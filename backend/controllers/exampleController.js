import { asyncHandler } from "../middleware/errorHandler.js";
import { DatabaseUtils, dbHelpers } from "../utils/database.js";
import { 
  sendSuccess, 
  sendCreated, 
  sendUpdated, 
  sendDeleted, 
  sendPaginatedResponse 
} from "../utils/response.js";
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError, 
  AuthorizationError 
} from "../utils/errors.js";

/**
 * Example controller demonstrating the new error handling system
 */
export class ExampleController {
  
  /**
   * Get all items with pagination
   */
  static getAllItems = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    
    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    let sql = 'SELECT * FROM items WHERE deleted_at IS NULL';
    let params = [];

    // Add search functionality
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await DatabaseUtils.paginate(sql, params, pageNum, limitNum);
    
    return sendPaginatedResponse(
      res, 
      result.data, 
      pageNum, 
      limitNum, 
      result.pagination.totalItems,
      'Items retrieved successfully'
    );
  });

  /**
   * Get item by ID
   */
  static getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('Item ID is required');
    }

    const item = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    return sendSuccess(res, item, 'Item retrieved successfully');
  });

  /**
   * Create new item
   */
  static createItem = asyncHandler(async (req, res) => {
    const { name, description, price, category } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      throw new ValidationError('Name and description are required');
    }

    // Validate price if provided
    if (price && (isNaN(price) || price < 0)) {
      throw new ValidationError('Price must be a positive number');
    }

    // Check if item with same name already exists
    const existingItem = await DatabaseUtils.exists(
      'SELECT id FROM items WHERE name = ? AND deleted_at IS NULL',
      [name]
    );

    if (existingItem) {
      throw new ConflictError('Item with this name already exists');
    }

    const itemData = {
      name,
      description,
      price: price || 0,
      category: category || 'general',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const result = await dbHelpers.create('items', itemData);
    
    // Fetch the created item
    const newItem = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    return sendCreated(res, newItem, 'Item created successfully');
  });

  /**
   * Update item
   */
  static updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    
    if (!id) {
      throw new ValidationError('Item ID is required');
    }

    // Check if item exists
    const existingItem = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    // Validate price if provided
    if (price && (isNaN(price) || price < 0)) {
      throw new ValidationError('Price must be a positive number');
    }

    // Check for name conflict if name is being updated
    if (name && name !== existingItem.name) {
      const nameConflict = await DatabaseUtils.exists(
        'SELECT id FROM items WHERE name = ? AND id != ? AND deleted_at IS NULL',
        [name, id]
      );

      if (nameConflict) {
        throw new ConflictError('Item with this name already exists');
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(category && { category }),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await dbHelpers.updateById('items', id, updateData);
    
    // Fetch the updated item
    const updatedItem = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );

    return sendUpdated(res, updatedItem, 'Item updated successfully');
  });

  /**
   * Delete item (soft delete)
   */
  static deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('Item ID is required');
    }

    // Check if item exists
    await DatabaseUtils.findOne(
      'SELECT id FROM items WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    await dbHelpers.softDelete('items', id);

    return sendDeleted(res, 'Item deleted successfully');
  });

  /**
   * Bulk operations example
   */
  static bulkUpdateItems = asyncHandler(async (req, res) => {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required and must not be empty');
    }

    // Validate each item
    for (const item of items) {
      if (!item.id) {
        throw new ValidationError('Item ID is required for all items');
      }
      if (item.price && (isNaN(item.price) || item.price < 0)) {
        throw new ValidationError(`Invalid price for item ${item.id}`);
      }
    }

    const results = await DatabaseUtils.transaction(async () => {
      const updateResults = [];
      
      for (const item of items) {
        const updateData = {
          ...(item.name && { name: item.name }),
          ...(item.description && { description: item.description }),
          ...(item.price !== undefined && { price: item.price }),
          ...(item.category && { category: item.category }),
          updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        const result = await dbHelpers.updateById('items', item.id, updateData);
        updateResults.push({ id: item.id, ...result });
      }
      
      return updateResults;
    });

    return sendUpdated(res, results, 'Items updated successfully');
  });

  /**
   * Example with authorization check
   */
  static getItemWithAuth = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user } = req; // Assuming user is set by auth middleware
    
    if (!id) {
      throw new ValidationError('Item ID is required');
    }

    // Check if user has permission to access this item
    if (!user || user.role !== 'admin') {
      throw new AuthorizationError('Insufficient permissions to access this item');
    }

    const item = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    return sendSuccess(res, item, 'Item retrieved successfully');
  });

  /**
   * Example with complex validation
   */
  static createItemWithValidation = asyncHandler(async (req, res) => {
    const { name, description, price, category, tags } = req.body;
    
    // Complex validation
    const errors = [];
    
    if (!name || name.trim().length < 3) {
      errors.push('Name must be at least 3 characters long');
    }
    
    if (!description || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        errors.push('Price must be a positive number');
      }
      if (price > 10000) {
        errors.push('Price cannot exceed $10,000');
      }
    }
    
    if (category && !['electronics', 'clothing', 'books', 'other'].includes(category)) {
      errors.push('Invalid category. Must be one of: electronics, clothing, books, other');
    }
    
    if (tags && (!Array.isArray(tags) || tags.length > 5)) {
      errors.push('Tags must be an array with maximum 5 items');
    }
    
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    // Check for duplicate name
    const existingItem = await DatabaseUtils.exists(
      'SELECT id FROM items WHERE name = ? AND deleted_at IS NULL',
      [name.trim()]
    );

    if (existingItem) {
      throw new ConflictError('Item with this name already exists');
    }

    const itemData = {
      name: name.trim(),
      description: description.trim(),
      price: price || 0,
      category: category || 'other',
      tags: tags ? JSON.stringify(tags) : null,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const result = await dbHelpers.create('items', itemData);
    
    const newItem = await DatabaseUtils.findOne(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    return sendCreated(res, newItem, 'Item created successfully');
  });
}
