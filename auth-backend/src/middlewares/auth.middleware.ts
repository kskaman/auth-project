import type { RequestHandler } from "express";

import { verifyAccessToken } from "../utils/jwt.util";
import type { AuthRequest } from "../types/authenticated-request";
import User from "../models/user.model";

const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Authorization header is malformed");
  }

  const token = parts[1];

  try {
    const payload = verifyAccessToken(token);
    const jwtPayload = payload as {
      userId: string;
      role: "user" | "admin";
      tokenVersion: number;
    };

    const user = await User.findById(jwtPayload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.tokenVersion !== jwtPayload.tokenVersion) {
      throw new Error("Session expired. Please log in again.");
    }
    const authReq = req as AuthRequest;
    authReq.user = {
      id: jwtPayload.userId,
      role: jwtPayload.role,
    };
    next();
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export default authenticate;
