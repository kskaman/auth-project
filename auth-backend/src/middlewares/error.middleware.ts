import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

// Maps known error messages to their HTTP status codes
const errorStatusMap: Record<string, number> = {
  "Verification token is required": 400,
  "Invalid or expired verification token": 400,
  "Email and password are required": 400,
  "Password reset token is required": 400,
  "Invalid or expired password reset token": 400,
  "Current and new password are required": 400,
  "Admins cannot change their own account status": 400,
  "Invalid account status": 400,

  "Invalid credentials": 401,
  "Authorization header is missing": 401,
  "Authorization header is malformed": 401,
  "Invalid or expired token": 401,
  "User not authenticated": 401,
  "Session expired. Please log in again": 401,
  "Current password is incorrect": 401,
  "Token expired. Please log in again.": 401,
  "Invalid Authentication token": 401,

  "Please verify your email before logging in": 403,
  "Account disabled. Contact support.": 403,
  "Access denied": 403,

  "User not found": 404,

  "User already exists": 409,
};

const errorHandler = (
  err: Error & { code?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Mongoose validation error (e.g. missing required fields like password)
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose duplicate key error (e.g. unique index on email)
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: "A record with that value already exists" });
  }

  // Known operational errors matched by message
  const statusCode = errorStatusMap[err.message];
  if (statusCode) {
    return res.status(statusCode).json({ message: err.message });
  }

  // Unexpected error
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

export default errorHandler;
