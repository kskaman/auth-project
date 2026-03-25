import { Request, Response, NextFunction } from "express";

import { registerUser, verifyEmail } from "../services/auth.service";

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
