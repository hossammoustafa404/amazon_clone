const { StatusCodes } = require("http-status-codes");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

class UnAuthorizedError extends AppError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnAuthorizedError,
};
