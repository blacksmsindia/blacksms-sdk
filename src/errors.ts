/**
 * Base class for all errors thrown by the BlackSMS SDK.
 */
export class BlackSMSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlackSMSError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception thrown when the BlackSMS API returns a non-2xx status code
 * or a payload containing error indicators (`status: 0` or `success: false`).
 */
export class BlackSMSAPIError extends BlackSMSError {
  /**
   * HTTP status code (e.g. 400, 401, 500) if available.
   */
  public readonly statusCode?: number;

  /**
   * The parsed response body from the BlackSMS API.
   */
  public readonly response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = 'BlackSMSAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Exception thrown when a network failure or request timeout occurs.
 */
export class BlackSMSNetworkError extends BlackSMSError {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'BlackSMSNetworkError';
    this.cause = cause;
  }
}
