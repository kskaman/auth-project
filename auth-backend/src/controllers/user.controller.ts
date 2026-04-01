import type { RequestHandler } from "express";
import type { AuthRequest } from "../types/authenticated-request";

export const getMe: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  res.json({
    id: authReq.user.id,
    role: authReq.user.role,
  });
};
