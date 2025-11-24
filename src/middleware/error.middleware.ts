import { AppError } from "@/errors/AppErrors.js";
import type { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * Catches all errors from previous middleware/controllers and sends a formatted response.
 *
 * @param err - The error object (can be AppError or unknown)
 * @param _req - Express Request object (unused)
 * @param res - Express Response object
 * @param _next - Express NextFunction (unused but required for error middleware signature)
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle known AppErrors (including validation errors with details)
  if (err instanceof AppError) {
    const baseResponse = {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
    };

    // Check if it's a validation error with field-level details
    if ("details" in err && Array.isArray(err.details)) {
      return res.status(err.statusCode).json({
        error: {
          ...baseResponse,
          details: err.details,
        },
      });
    }

    return res.status(err.statusCode).json({
      error: baseResponse,
    });
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
  });
};
