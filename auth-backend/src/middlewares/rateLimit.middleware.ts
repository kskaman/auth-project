import { rateLimit } from "express-rate-limit";

import { globalRateLimit, loginRateLimit } from "../config/security";

export const globalLimiter = rateLimit({
  windowMs: globalRateLimit.windowMs,
  max: globalRateLimit.max,
  message: globalRateLimit.message,
});

export const loginLimiter = rateLimit({
  windowMs: loginRateLimit.windowMs,
  max: loginRateLimit.max,
  message: loginRateLimit.message,
});
