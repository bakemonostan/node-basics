/**
 * Creates a standardized API response envelope.
 *
 * @param statusCode - HTTP status code (200, 201, 400, etc.)
 * @param data - Response payload (can be object, array, or null)
 * @param message - Human-readable success/error message
 * @returns Standardized response object
 */
export const createResponse = (
  statusCode: number,
  data: unknown,
  message: string
) => {
  const statusText =
    statusCode >= 200 && statusCode < 300 ? "success" : "error";
  return {
    statusCode,
    statusText,
    message,
    data,
  };
};
