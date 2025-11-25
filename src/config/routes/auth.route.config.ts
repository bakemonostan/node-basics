// src/config/routes/auth.route.config.ts

import { registry } from "@/config/openapi.config.js";
import { loginSchema, registerSchema } from "@/validations/auth.schema.js";
import {
  userSuccessResponse,
  validationErrorResponse,
  errorResponse,
} from "@/config/responses.config.js";

// ============================================================================
// Auth-Specific Response Customizations
// ============================================================================

const sessionCookieHeader = {
  "Set-Cookie": {
    description:
      "Session cookie (connect.sid) - HTTP-only, Secure (in prod), SameSite=Lax",
    schema: {
      type: "string" as const,
      example: "connect.sid=s%3A...; Path=/; HttpOnly; SameSite=Lax",
    },
  },
};

// Wrapper to add session cookie header to user success responses
const authSuccessResponse = (statusCode: number, message: string) => ({
  ...userSuccessResponse(statusCode, message),
  description: `${message}. Session cookie is set automatically.`,
  headers: sessionCookieHeader,
});

// ============================================================================
// Auth Route Registrations
// ============================================================================

export function registerAuthRoutes() {
  // Register endpoint
  registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    summary: "Register a new user",
    description:
      "Creates a new user account and establishes a session. A session cookie will be automatically set in the response.",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: registerSchema,
          },
        },
      },
    },
    responses: {
      201: authSuccessResponse(201, "User registered successfully"),
      400: validationErrorResponse,
      409: errorResponse(
        409,
        "Email already in use",
        "EMAIL_ALREADY_EXISTS",
        "Email already in use",
        "2025-11-25T00:41:22.742Z"
      ),
    },
  });

  // Login endpoint
  registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    summary: "Log in an existing user",
    description:
      "Authenticates a user and establishes a session. A session cookie will be automatically set in the response.",
    tags: ["Auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: authSuccessResponse(200, "User logged in successfully"),
      400: validationErrorResponse,
      401: errorResponse(
        401,
        "Invalid credentials",
        "INVALID_CREDENTIALS",
        "Invalid credentials",
        "2025-11-25T00:43:03.837Z"
      ),
    },
  });
}
