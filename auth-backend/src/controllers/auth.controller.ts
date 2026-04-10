import { Request, Response, NextFunction } from "express";

import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../services/auth.service";

import { listUsers, setUserStatus } from "../services/admin.service";
import { AuthRequest } from "../types/authenticated-request";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token as string;
    const result = await verifyEmail(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token as string;
    const newPassword = req.body.password;

    if (!token) {
      throw new Error("Password reset token is required");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;
    const result = await logoutUser(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const listUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = (req.query.status as string) || "";
    const search = (req.query.search as string) || "";

    const result = await listUsers({ status, search });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const adminId = req.user.id;
    const targetUserId = req.params.targetUserId;
    const { status } = req.body;

    const result = await setUserStatus(adminId, targetUserId, status);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
