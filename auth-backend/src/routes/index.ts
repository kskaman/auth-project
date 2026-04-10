import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

router.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true, message: "API is healthy" });
});

export default router;
