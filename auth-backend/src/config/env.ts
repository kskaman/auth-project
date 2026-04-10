import { StringValue } from "ms";

import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;

  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;

  APP_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: StringValue;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: StringValue;
}

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key} (check your .env file)`);
  }
  return value;
}

const env: EnvConfig = {
  NODE_ENV: getEnvOrThrow("NODE_ENV"),
  PORT: parseInt(getEnvOrThrow("PORT")),
  MONGO_URI: getEnvOrThrow("MONGO_URI"),

  EMAIL_HOST: getEnvOrThrow("EMAIL_HOST"),
  EMAIL_PORT: parseInt(getEnvOrThrow("EMAIL_PORT")),
  EMAIL_USER: getEnvOrThrow("EMAIL_USER"),
  EMAIL_PASS: getEnvOrThrow("EMAIL_PASS"),

  APP_URL: getEnvOrThrow("APP_URL"),

  JWT_SECRET: getEnvOrThrow("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvOrThrow("JWT_EXPIRES_IN") as StringValue,
  JWT_REFRESH_SECRET: getEnvOrThrow("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: getEnvOrThrow("JWT_REFRESH_EXPIRES_IN") as StringValue,
};

if (!env.MONGO_URI) {
  throw new Error("Missing required env var: MONGO_URI (check your .env file)");
}

export default env;
