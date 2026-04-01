import type { Request } from "express";

export type AuthUserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  role: AuthUserRole;
}

// Use this when a route/middleware may or may not have authenticated user.
export type AuthRequest = Request & {
  user?: AuthUser;
};
