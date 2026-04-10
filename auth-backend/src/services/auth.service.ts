import User from "../models/user.model";

import EmailVerificationToken from "../models/emailVerificationToken.model";
import RefreshToken from "../models/refreshToken.model";

import { generateToken, hashToken } from "../utils/token.util";
import { sendEmail } from "../services/email.service";
import {
  buildPasswordResetEmail,
  buildVerificationEmail,
} from "../utils/emailTemplate.util";
import env from "../config/env";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util";
import PasswordResetToken from "../models/passwordResetToken.model";

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

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (user.status === "unverified") {
    throw new Error("Please verify your email before logging in");
  }

  if (user.status === "disabled") {
    throw new Error("Account disabled. Contact support.");
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token in database
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  };
};

export const logoutUser = async (userId: string) => {
  // Invalidate all existing tokens by incrementing token version
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.tokenVersion += 1;
  await user.save();

  // Delete all refresh tokens for this user
  await RefreshToken.deleteMany({ userId });

  return {
    message: "Logged out successfully",
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Verify the refresh token
  let payload: any;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  // Check if refresh token exists in database
  const tokenRecord = await RefreshToken.findOne({
    token: refreshToken,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    throw new Error("Refresh token not found or expired");
  }

  // Get user and verify token version
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    // Delete invalid refresh token
    await RefreshToken.deleteOne({ token: refreshToken });
    throw new Error("Session expired. Please log in again.");
  }

  // Generate new access token
  const newPayload = {
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = signAccessToken(newPayload);

  return {
    accessToken,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "If the email exists, a password reset link has been sent to your inbox.",
    };
  }

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  await PasswordResetToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Token expires in 1 hour
    used: false,
  });

  const resetUrl = `${env.APP_URL}/api/auth/reset-password?token=${rawToken}`;

  await sendEmail(
    user.email,
    "Password Reset Request",
    buildPasswordResetEmail(resetUrl),
  );

  return {
    message:
      "If the email exists, a password reset link has been sent to your inbox.",
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token) {
    throw new Error("Password reset token is required");
  }

  const hashedToken = hashToken(token);

  const record = await PasswordResetToken.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() },
  }).select("+token");

  if (!record) {
    throw new Error("Invalid or expired password reset token");
  }

  const user = await User.findById(record.userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  user.tokenVersion += 1; // Invalidate existing tokens
  await user.save();

  record.used = true;
  await record.save();

  return {
    message: "Password reset successful",
  };
};
