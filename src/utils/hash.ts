// src/utils/hash.ts

import { argon2id, hash, verify } from "argon2";

/**
 * Hashes a plain-text password using Argon2id (OWASP recommended).
 */
export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, { type: argon2id });
};

/**
 * Verifies a plain-text password against a hashed password.
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return verify(hashedPassword, password);
};
