import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
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
};

if (!env.MONGO_URI) {
  throw new Error("Missing required env var: MONGO_URI (check your .env file)");
}

export default env;
