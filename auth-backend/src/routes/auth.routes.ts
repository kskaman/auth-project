import express from "express";
import {
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);

export default router;
