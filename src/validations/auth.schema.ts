/**
 * Zod schemas for auth-related input validation.
 * These schemas define the expected shape and rules for incoming data.
 */
import { z } from "zod";
import { registry } from "@/config/openapi.config.js";

/**
 * Schema for user registration requests.
 * - email: must be a valid email, trimmed and lowercased
 * - password: must be 8–128 characters
 */
export const registerSchema = registry.register(
  "RegisterInput",
  z
    .object({
      email: z.email().trim().toLowerCase().openapi({
        description: "User's email address",
        example: "user@example.com",
      }),
      password: z
        .string()
        .min(8)
        .max(128)
        .refine(
          (value) =>
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
              value
            ),
          {
            message:
              "Password must contain a special character, a number, a mix of uppercase and lowercase letters, and be at least 8 characters long",
          }
        )
        .openapi({
          description:
            "Password must contain a special character, a number, a mix of uppercase and lowercase letters, and be at least 8 characters long",
          example: "Password123!",
          minLength: 8,
          maxLength: 128,
        }),
    })
    .openapi("RegisterInput")
);

/**
 * Schema for user login requests.
 */
export const loginSchema = registry.register(
  "LoginInput",
  z
    .object({
      email: z.email().trim().toLowerCase().openapi({
        description: "User's email address",
        example: "user@example.com",
      }),
      password: z.string().min(8).openapi({
        description: "User's password",
        example: "Password123!",
        minLength: 8,
      }),
    })
    .openapi("LoginInput")
);
