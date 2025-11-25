// src/config/responses.config.ts

import { z } from "zod";
import {
  SuccessResponseSchema,
  UserSchema,
  ErrorSchema,
  ValidationErrorSchema,
} from "./openapi.config.js";

// ============================================================================
// Generic Reusable Response Builders
// ============================================================================

/**
 * Standard validation error response (400)
 */
export const validationErrorResponse = {
  description: "Validation failed",
  content: {
    "application/json": {
      schema: ValidationErrorSchema,
    },
  },
};

/**
 * Generic error response builder
 */
export const errorResponse = (
  statusCode: number,
  description: string,
  code: string,
  message: string,
  timestamp: string = "2025-11-25T00:00:00.000Z"
) => ({
  description,
  content: {
    "application/json": {
      schema: ErrorSchema,
      example: {
        error: { message, code, statusCode, timestamp },
      },
    },
  },
});

/**
 * Generic success response with user data
 */
export const userSuccessResponse = (statusCode: number, message: string) => ({
  description: message,
  content: {
    "application/json": {
      schema: SuccessResponseSchema(z.object({ user: UserSchema })),
      example: {
        status: "success",
        message,
        data: {
          user: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "user@example.com",
            createdAt: "2025-11-25T00:00:00.000Z",
          },
        },
      },
    },
  },
});
