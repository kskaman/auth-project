import User from "../models/user.model";

import EmailVerificationToken from "../models/emailVerificationToken.model";

import { generateToken, hashToken } from "../utils/token.util";
import { sendEmail } from "../services/email.service";
import { buildVerificationEmail } from "../utils/emailTemplate.util";
import env from "../config/env";

export const registerUser = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({ email, password });

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  // Save verification token to database
  await EmailVerificationToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token expires in 24 hours
    used: false,
  });

  // Send verification email
  const verifyUrl = `${env.APP_URL}/api/auth/verify-email?token=${rawToken}`;

  await sendEmail(
    user.email,
    "Verify Your Email Address",
    buildVerificationEmail(verifyUrl),
  );

  return {
    message:
      "Registration successful. Please check your email to verify your account.",
  };
};

export const verifyEmail = async (token: string) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const hashedToken = hashToken(token);

  const record = await EmailVerificationToken.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() },
  }).select("+token");

  if (!record) {
    throw new Error("Invalid or expired verification token");
  }

  const user = await User.findById(record.userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.status = "active";
  await user.save();

  record.used = true;
  await record.save();

  return {
    message: "Email verified successfully. You can now log in.",
  };
};
