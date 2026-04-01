import express, { Request, Response } from "express";

import authenticate from "../middlewares/auth.middleware";
import authorizeRole from "../middlewares/role.middleware";

import { getMe } from "../controllers/user.controller";

const router = express.Router();

// Get current user info
router.get("/me", authenticate, getMe);

// admin only route
router.get(
  "/admin-only",
  authenticate,
  authorizeRole("admin"),
  (req: Request, res: Response) => {
    res.json({ message: "Welcome, admin!" });
  },
);

export default router;
