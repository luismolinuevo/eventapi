class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // This flag distinguishes operational errors
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || "Validation Error", 400);
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message || "Auth Error", 401);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || "Resource Not Found", 404);
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message || "Database Error", 500);
  }
}

// Example of a Programming Error (not operational)
class ProgrammingError extends Error {
  constructor(message) {
    super(message || "Programming Error");
    this.statusCode = 500;
    this.status = "error";
    this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

export {
  AppError,
  ValidationError,
  AuthError,
  NotFoundError,
  DatabaseError,
  ProgrammingError,
};
