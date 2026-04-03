import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
