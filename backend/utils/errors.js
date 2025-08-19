// Custom Error Classes
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.type = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.type = 'ConflictError';
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500);
    this.type = 'DatabaseError';
    this.originalError = originalError;
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.type = 'RateLimitError';
  }
}

// Error utility functions
export const handleDatabaseError = (err) => {
  // If it's already a DatabaseError with a custom message, preserve it
  if (err instanceof DatabaseError && err.message !== 'Database operation failed') {
    return err;
  }
  
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.message.match(/for key '(.+)'/)?.[1] || 'field';
    return new ConflictError(`${field} already exists`);
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return new ValidationError('Referenced record does not exist');
  }
  
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return new ConflictError('Cannot delete record as it is referenced by other records');
  }
  
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return new ValidationError('Invalid field name');
  }
  
  if (err.code === 'ER_PARSE_ERROR') {
    return new DatabaseError('Database query syntax error', err);
  }
  
  // For other database errors, preserve the original message if available
  const message = err.message || 'Database operation failed';
  return new DatabaseError(message, err);
};

export const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  return new ValidationError('Invalid input data', errors);
};

export const handleJWTError = () => {
  return new AuthenticationError('Invalid token. Please log in again!');
};

export const handleJWTExpiredError = () => {
  return new AuthenticationError('Your token has expired! Please log in again.');
};

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ValidationError(message);
};

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ConflictError(message);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ValidationError(message, errors);
};

// Error logging utility
export const logError = (error, req = null) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      type: error.type
    },
    request: req ? {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body,
      params: req.params,
      query: req.query
    } : null
  };
  
  console.error('Error Log:', JSON.stringify(errorLog, null, 2));
  
  // In production, you might want to send this to a logging service
  // like Winston, Bunyan, or external services like Sentry
};

// Async error wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Check if headers have already been sent
      if (!res.headersSent) {
        next(err);
      }
    });
  };
};
