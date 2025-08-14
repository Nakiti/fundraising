// Standardized Response Utilities

/**
 * Success Response Helper
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * Error Response Helper
 */
export const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  const response = {
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    ...(error.type && { errorType: error.type }),
    timestamp: new Date().toISOString()
  };

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Pagination Response Helper
 */
export const sendPaginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const response = {
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      ...(hasNextPage && { nextPage: page + 1 }),
      ...(hasPrevPage && { prevPage: page - 1 })
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(response);
};

/**
 * Created Response Helper
 */
export const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Updated Response Helper
 */
export const sendUpdated = (res, data, message = 'Resource updated successfully') => {
  return sendSuccess(res, data, message, 200);
};

/**
 * Deleted Response Helper
 */
export const sendDeleted = (res, message = 'Resource deleted successfully') => {
  return sendSuccess(res, null, message, 200);
};

/**
 * No Content Response Helper
 */
export const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Validation Error Response Helper
 */
export const sendValidationError = (res, errors, message = 'Validation failed') => {
  const response = {
    success: false,
    message,
    errors,
    errorType: 'ValidationError',
    timestamp: new Date().toISOString()
  };

  return res.status(400).json(response);
};

/**
 * Not Found Response Helper
 */
export const sendNotFound = (res, resource = 'Resource') => {
  const response = {
    success: false,
    message: `${resource} not found`,
    errorType: 'NotFoundError',
    timestamp: new Date().toISOString()
  };

  return res.status(404).json(response);
};

/**
 * Unauthorized Response Helper
 */
export const sendUnauthorized = (res, message = 'Authentication required') => {
  const response = {
    success: false,
    message,
    errorType: 'AuthenticationError',
    timestamp: new Date().toISOString()
  };

  return res.status(401).json(response);
};

/**
 * Forbidden Response Helper
 */
export const sendForbidden = (res, message = 'Access denied') => {
  const response = {
    success: false,
    message,
    errorType: 'AuthorizationError',
    timestamp: new Date().toISOString()
  };

  return res.status(403).json(response);
};

/**
 * Conflict Response Helper
 */
export const sendConflict = (res, message = 'Resource conflict') => {
  const response = {
    success: false,
    message,
    errorType: 'ConflictError',
    timestamp: new Date().toISOString()
  };

  return res.status(409).json(response);
};

/**
 * Rate Limit Response Helper
 */
export const sendRateLimitExceeded = (res, message = 'Too many requests') => {
  const response = {
    success: false,
    message,
    errorType: 'RateLimitError',
    timestamp: new Date().toISOString()
  };

  return res.status(429).json(response);
};

/**
 * Database Error Response Helper
 */
export const sendDatabaseError = (res, message = 'Database operation failed') => {
  const response = {
    success: false,
    message,
    errorType: 'DatabaseError',
    timestamp: new Date().toISOString()
  };

  return res.status(500).json(response);
};

/**
 * Generic Error Response Helper
 */
export const sendInternalError = (res, message = 'Internal server error') => {
  const response = {
    success: false,
    message,
    errorType: 'InternalError',
    timestamp: new Date().toISOString()
  };

  return res.status(500).json(response);
};
