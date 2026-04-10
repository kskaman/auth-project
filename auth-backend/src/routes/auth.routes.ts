import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";
import { loginLimiter } from "../middlewares/rateLimit.middleware";
import authenticate from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginLimiter, loginController);
router.post("/logout", authenticate, logoutController);
router.post("/forgot-password", loginLimiter, forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
