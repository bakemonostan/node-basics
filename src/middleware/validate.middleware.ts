/**
 * Middleware to validate request body using Zod schemas.
 * Throws AppError with structured validation details on failure.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppErrors.js";

/**
 * Validation error details structure.
 */
interface ValidationErrorDetail {
  field: string;
  message: string;
}

/**
 * Extended AppError for validation errors.
 */
class ValidationError extends AppError {
  details: ValidationErrorDetail[];

  constructor(details: ValidationErrorDetail[]) {
    super("Validation failed", 400, "VALIDATION_FAILED");
    this.details = details;
    // Ensure prototype chain is preserved
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Validates the request body against a Zod schema.
 * If validation fails, throws a ValidationError with field-level details.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware
 */
export const validateBody = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details: ValidationErrorDetail[] = result.error.issues.map(
        (issue) => ({
          field: issue.path.join("."), // e.g. "password"
          message: issue.message,
        })
      );

      return next(new ValidationError(details));
    }

    next();
  };
};
