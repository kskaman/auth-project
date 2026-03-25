import crypto from "crypto";

export const generateToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * createHash("sha-256") creates a hash object using the SHA-256 algorithm,
 * update(token) passes the token to hash object for the token to be
 * hashed using the algorithm object is created with.
 * digest("hex") converts the hashed token into a hexadecimal string format,
 * which is a common way to represent hashed values.
 */
