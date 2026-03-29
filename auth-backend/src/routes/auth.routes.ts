import express from "express";
import {
  loginController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);

export default router;
