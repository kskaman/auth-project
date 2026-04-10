import jwt from "jsonwebtoken";
import env from "../config/env";

interface TokenPayload {
  userId: string | number;
  role: string;
  tokenVersion: number;
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
