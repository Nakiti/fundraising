# Error Handling and Response System

This document describes the comprehensive error handling and response system implemented for the backend API.

## Overview

The error handling system provides:
- **Consistent error responses** across all endpoints
- **Custom error classes** for different types of errors
- **Automatic error logging** with request context
- **Database error handling** with specific error types
- **Validation error handling** with detailed error messages
- **Async error handling** with automatic promise rejection catching
- **Production vs Development** error handling modes

## File Structure

```
backend/
├── utils/
│   ├── errors.js          # Custom error classes and utilities
│   ├── response.js        # Standardized response helpers
│   └── database.js        # Database utility wrapper
├── middleware/
│   ├── errorHandler.js    # Global error handling middleware
│   └── validation.js      # Input validation middleware
└── controllers/
    └── exampleController.js # Example usage
```

## Error Classes

### Base Error Class
```javascript
class AppError extends Error {
  constructor(message, statusCode, isOperational = true)
}
```

### Specific Error Classes
- `ValidationError` (400) - Input validation errors
- `AuthenticationError` (401) - Authentication failures
- `AuthorizationError` (403) - Authorization failures
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflicts
- `DatabaseError` (500) - Database operation failures
- `RateLimitError` (429) - Rate limiting violations

## Response Helpers

### Success Responses
```javascript
sendSuccess(res, data, message, statusCode)
sendCreated(res, data, message)
sendUpdated(res, data, message)
sendDeleted(res, message)
sendNoContent(res)
sendPaginatedResponse(res, data, page, limit, total, message)
```

### Error Responses
```javascript
sendError(res, error)
sendValidationError(res, errors, message)
sendNotFound(res, resource)
sendUnauthorized(res, message)
sendForbidden(res, message)
sendConflict(res, message)
sendRateLimitExceeded(res, message)
sendDatabaseError(res, message)
sendInternalError(res, message)
```

## Database Utilities

### DatabaseUtils Class
```javascript
// Basic operations
DatabaseUtils.query(sql, params)
DatabaseUtils.findOne(sql, params)
DatabaseUtils.findAll(sql, params)
DatabaseUtils.insert(sql, params)
DatabaseUtils.update(sql, params)
DatabaseUtils.delete(sql, params)

// Advanced operations
DatabaseUtils.transaction(callback)
DatabaseUtils.exists(sql, params)
DatabaseUtils.count(sql, params)
DatabaseUtils.paginate(sql, params, page, limit)
```

### Helper Functions
```javascript
dbHelpers.create(table, data)
dbHelpers.findById(table, id, columns)
dbHelpers.findByField(table, field, value, columns)
dbHelpers.findAll(table, columns, where, params)
dbHelpers.updateById(table, id, data)
dbHelpers.deleteById(table, id)
dbHelpers.softDelete(table, id)
```

## Usage Examples

### Basic Controller with Error Handling
```javascript
import { asyncHandler } from "../middleware/errorHandler.js";
import { sendSuccess, sendCreated } from "../utils/response.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

export const getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Item ID is required');
  }

  const item = await DatabaseUtils.findOne(
    'SELECT * FROM items WHERE id = ?',
    [id]
  );

  return sendSuccess(res, item, 'Item retrieved successfully');
});
```

### Controller with Complex Validation
```javascript
export const createItem = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;
  
  // Validation
  const errors = [];
  if (!name || name.trim().length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  if (price && (isNaN(price) || price < 0)) {
    errors.push('Price must be a positive number');
  }
  if (category && !['A', 'B', 'C'].includes(category)) {
    errors.push('Invalid category');
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  // Check for duplicates
  const exists = await DatabaseUtils.exists(
    'SELECT id FROM items WHERE name = ?',
    [name.trim()]
  );
  
  if (exists) {
    throw new ConflictError('Item with this name already exists');
  }

  // Create item
  const result = await dbHelpers.create('items', {
    name: name.trim(),
    price: price || 0,
    category: category || 'A'
  });

  const newItem = await DatabaseUtils.findOne(
    'SELECT * FROM items WHERE id = ?',
    [result.insertId]
  );

  return sendCreated(res, newItem, 'Item created successfully');
});
```

### Transaction Example
```javascript
export const bulkUpdate = asyncHandler(async (req, res) => {
  const { items } = req.body;
  
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required');
  }

  const results = await DatabaseUtils.transaction(async () => {
    const updateResults = [];
    
    for (const item of items) {
      const result = await dbHelpers.updateById('items', item.id, item.data);
      updateResults.push({ id: item.id, ...result });
    }
    
    return updateResults;
  });

  return sendUpdated(res, results, 'Items updated successfully');
});
```

## Middleware Usage

### Global Error Handler
The global error handler is automatically applied in `index.js`:

```javascript
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Apply after all routes
app.use(notFoundHandler);
app.use(globalErrorHandler);
```

### Validation Middleware
```javascript
import { validateLogin, validateRegistration } from "./middleware/validation.js";

router.post('/login', validateLogin, loginController);
router.post('/register', validateRegistration, registerController);
```

## Error Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Email must be valid"
  ],
  "errorType": "ValidationError",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment-Specific Behavior

### Development Mode
- Includes stack traces in error responses
- Detailed error logging
- Verbose error messages

### Production Mode
- No stack traces in responses
- Sanitized error messages
- Minimal error details exposed to clients

## Best Practices

1. **Always use asyncHandler** for controller functions
2. **Validate input** before processing
3. **Use specific error classes** for different error types
4. **Check for existence** before updates/deletes
5. **Use transactions** for multi-step operations
6. **Log errors** with appropriate context
7. **Handle database errors** specifically
8. **Use consistent response formats**

## Migration Guide

### Before (Old Pattern)
```javascript
export const getItem = (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM items WHERE id = ?', [id], (err, data) => {
    if (err) return console.log(err);
    return res.status(200).json(data);
  });
};
```

### After (New Pattern)
```javascript
export const getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Item ID is required');
  }

  const item = await DatabaseUtils.findOne(
    'SELECT * FROM items WHERE id = ?',
    [id]
  );

  return sendSuccess(res, item, 'Item retrieved successfully');
});
```

## Testing Error Handling

### Test Error Scenarios
```javascript
// Test validation errors
expect(response.status).toBe(400);
expect(response.body.errorType).toBe('ValidationError');

// Test not found errors
expect(response.status).toBe(404);
expect(response.body.errorType).toBe('NotFoundError');

// Test database errors
expect(response.status).toBe(500);
expect(response.body.errorType).toBe('DatabaseError');
```

This error handling system provides a robust foundation for building reliable and maintainable APIs with consistent error responses and proper error logging.
