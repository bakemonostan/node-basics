/**
 * Custom application error class for handling operational errors.
 * Extends the built-in Error class with additional properties for HTTP status codes and error codes.
 */
export class AppError extends Error {
  statusCode: number;
  code: string;

  /**
   * Creates a new AppError instance.
   *
   * @param message - Descriptive error message
   * @param statusCode - HTTP status code associated with the error (e.g., 404, 500)
   * @param code - Application-specific error code (e.g., 'USER_NOT_FOUND')
   */
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
