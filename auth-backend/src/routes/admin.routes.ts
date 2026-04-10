import express from "express";
import {
  listUsersController,
  updateUserStatus,
} from "../controllers/auth.controller";
import authorizeRole from "../middlewares/role.middleware";
import authenticate from "../middlewares/auth.middleware";

const router = express.Router();

// All routes in this file require authentication and admin role
router.use(authenticate);
router.use(authorizeRole("admin"));

router.get("/users", listUsersController);
router.patch("/users/:targetUserId/status", updateUserStatus);

export default router;
