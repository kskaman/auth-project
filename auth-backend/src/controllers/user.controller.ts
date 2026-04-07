import type { RequestHandler, Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../types/authenticated-request";
import {
  updateProfile,
  getCurrentUser,
  changePassword,
} from "../services/user.service";

export const getMe: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const result = await getCurrentUser(authReq.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const result = await updateProfile(authReq.user.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const changeMyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { currentPassword, newPassword } = req.body;

    const result = await changePassword(
      authReq.user.id,
      currentPassword,
      newPassword,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
