// src/config/openapi.config.ts

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Create the OpenAPI registry
export const registry = new OpenAPIRegistry();

// ============================================================================
// Reusable Response Schemas
// ============================================================================

/**
 * User schema for responses
 */
export const UserSchema = registry.register(
  "User",
  z
    .object({
      id: z.uuid().openapi({
        description: "Unique user identifier",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
      email: z.email().openapi({
        description: "User's email address",
        example: "user@example.com",
      }),
      createdAt: z.iso.datetime().openapi({
        description: "Account creation timestamp(new Date())",
        example: new Date(),
      }),
    })
    .openapi("User")
);

/**
 * Error response schema
 */
export const ErrorSchema = registry.register(
  "Error",
  z
    .object({
      error: z.object({
        message: z.string().openapi({
          description: "Error message",
          example: "An error occurred",
        }),
        code: z.string().openapi({
          description: "Error code",
          example: "ERROR_CODE",
        }),
        statusCode: z.number().openapi({
          description: "HTTP status code",
          example: 500,
        }),
        timestamp: z.string().datetime().openapi({
          description: "Error timestamp",
          example: "2025-11-25T00:00:00.000Z",
        }),
      }),
    })
    .openapi("Error")
);

/**
 * Validation error response schema
 */
export const ValidationErrorSchema = registry.register(
  "ValidationError",
  z
    .object({
      error: z.string().openapi({
        description: "Error message",
        example: "Validation failed",
      }),
      details: z
        .array(
          z.object({
            field: z.string().openapi({
              description: "Field that failed validation",
              example: "email",
            }),
            message: z.string().openapi({
              description: "Validation error message",
              example: "Invalid email format",
            }),
          })
        )
        .openapi({
          description: "Detailed validation errors",
        }),
    })
    .openapi("ValidationError")
);

/**
 * Success response wrapper
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal("success").openapi({
      description: "Response status",
      example: "success",
    }),
    message: z.string().openapi({
      description: "Success message",
    }),
    data: dataSchema,
  });

// ============================================================================
// OpenAPI Generator Configuration
// ============================================================================

/**
 * Generates the OpenAPI specification
 */
export function generateOpenAPISpec() {
  // Register security scheme
  registry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "connect.sid",
    description: "Session cookie automatically set after login/register",
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: `
## Authentication & Session Management

This API uses **HTTP-only session cookies** backed by Redis for secure authentication.

### API Documentation for Swagger UI/Postman 😎😎😎
http://localhost:3000/docs-json

### Security Features
- ✅ **HTTP-only cookies** - Prevents XSS attacks by blocking JavaScript access
- ✅ **Secure flag** - HTTPS-only transmission in production
- ✅ **SameSite=Lax** - CSRF protection
- ✅ **7-day expiration** - Automatic session cleanup
- ✅ **Redis-backed sessions** - Scalable and performant

### How It Works
1. **Register/Login** - Receive a session cookie automatically
2. **Authenticated Requests** - Cookie is sent automatically by the browser
3. **Logout** - Session is destroyed server-side

### Cookie Details
- **Name**: \`connect.sid\`
- **Path**: \`/\`
- **Max Age**: 7 days
- **Domain**: Current domain
      `.trim(),
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  });
}
