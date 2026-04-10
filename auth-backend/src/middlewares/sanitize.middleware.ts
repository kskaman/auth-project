// middlewares/sanitize.middleware.ts
import type { Request, Response, NextFunction } from "express";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (isPlainObject(value)) {
    const clean: PlainObject = {};

    for (const [key, val] of Object.entries(value)) {
      // Remove MongoDB operator injection patterns
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }

      clean[key] = sanitizeValue(val);
    }

    return clean;
  }

  return value;
}

export function sanitize(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeValue(req.params) as Request["params"];
  }

  // Important:
  // Do NOT do req.query = ...
  // Express 5 makes req.query read-only.
  next();
}
