import type { RequestHandler } from "express";
import type { AuthRequest } from "../types/authenticated-request";

const authorizeRole = (requiredRole: "user" | "admin") => {
  const handler: RequestHandler = (req, res, next) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    if (authReq.user.role !== requiredRole) {
      throw new Error("Access denied");
    }

    next();
  };

  return handler;
};

export default authorizeRole;
