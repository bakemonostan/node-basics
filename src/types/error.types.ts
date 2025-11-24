// src/types/error.types.ts
export interface ErrorResponse {
  error: {
    code: string; // machine-readable code (e.g., "EMAIL_NOT_FOUND")
    message: string; // human-readable message
    statusCode: number; // HTTP status code
    timestamp: string; // when it happened
    // path?: string;       // optional: request path
  };
}
