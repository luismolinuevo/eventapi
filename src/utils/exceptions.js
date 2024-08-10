class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || "Validation Error", 400);
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

export { AppError, ValidationError, NotFoundError, DatabaseError };
