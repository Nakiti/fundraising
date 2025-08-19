import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  DatabaseError, 
  RateLimitError,
  handleDatabaseError,
  handleValidationError,
  handleJWTError,
  handleJWTExpiredError,
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  logError,
  catchAsync
} from '../utils/errors.js';
import { sendError, sendNotFound } from '../utils/response.js';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  logError(err, req);

  // Handle specific error types
  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Handle database errors
  if (err.code && err.code.startsWith('ER_')) {
    error = handleDatabaseError(err);
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    error = err;
  }

  // Ensure we have a valid status code
  const statusCode = error.statusCode || 500;
  
  // Ensure we have a valid message
  const message = error.message || 'Something went wrong';

  // Check if headers have already been sent
  if (res.headersSent) {
    return;
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    ...(error.errors && { errors: error.errors }),
    ...(error.type && { errorType: error.type }),
    timestamp: new Date().toISOString()
  });
};

/**
 * 404 Handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  return sendNotFound(res, 'Route');
};

/**
 * Async Error Wrapper Middleware
 */
export const asyncHandler = (fn) => {
  return catchAsync(fn);
};

/**
 * Validation Error Handler
 */
export const validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Authentication Error Handler
 */
export const authenticationErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthenticationError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Authorization Error Handler
 */
export const authorizationErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthorizationError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Database Error Handler
 */
export const databaseErrorHandler = (err, req, res, next) => {
  if (err instanceof DatabaseError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Conflict Error Handler
 */
export const conflictErrorHandler = (err, req, res, next) => {
  if (err instanceof ConflictError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Rate Limit Error Handler
 */
export const rateLimitErrorHandler = (err, req, res, next) => {
  if (err instanceof RateLimitError) {
    if (!res.headersSent) {
      return sendError(res, err);
    }
  }
  next(err);
};

/**
 * Development Error Handler (with stack trace)
 */
export const developmentErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with full details
  logError(err, req);

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (err.code && err.code.startsWith('ER_')) {
    error = handleDatabaseError(err);
  }

  if (err instanceof AppError) {
    error = err;
  }

  // Include stack trace in development
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode || 500,
    stack: error.stack,
    ...(error.errors && { errors: error.errors }),
    ...(error.type && { errorType: error.type }),
    timestamp: new Date().toISOString()
  };

  return res.status(error.statusCode || 500).json(response);
};

/**
 * Production Error Handler (without stack trace)
 */
export const productionErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error (but don't expose details to client)
  logError(err, req);

  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (err.code && err.code.startsWith('ER_')) {
    error = handleDatabaseError(err);
  }

  if (err instanceof AppError) {
    error = err;
  }

  // Don't leak error details in production
  if (!error.isOperational) {
    error.message = 'Something went wrong!';
  }

  return sendError(res, error);
};

/**
 * Unhandled Promise Rejection Handler
 */
export const handleUnhandledRejection = (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err.name, err.message);
  logError(err);
  
  // Don't exit the process for unhandled rejections
  // This prevents crashes from frontend errors or network issues
  console.error('Continuing to run despite unhandled rejection...');
};

/**
 * Uncaught Exception Handler
 */
export const handleUncaughtException = (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err.name, err.message);
  logError(err);
  
  // Only exit for critical system errors, not application errors
  if (err.code === 'ECONNREFUSED' || 
      err.code === 'ENOTFOUND' || 
      err.code === 'EACCES' ||
      err.code === 'EADDRINUSE') {
    console.error('Critical system error detected, shutting down...');
    process.exit(1);
  }
  
  // For other exceptions, log but continue running
  console.error('Continuing to run despite uncaught exception...');
};
