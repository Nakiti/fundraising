import { db } from '../db.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';

/**
 * Base service class providing common database operations and utilities
 */
export class BaseService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Execute a database query with promise wrapper
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise} Promise resolving to query results
   */
  async executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          // Get the calling function from stack trace
          const stack = new Error().stack;
          const callerLine = stack.split('\n')[3] || 'Unknown caller';
          const callerMatch = callerLine.match(/at\s+(.+?)\s+\(/);
          const callerFunction = callerMatch ? callerMatch[1] : 'Unknown function';
          
          console.error('=== DATABASE ERROR ===');
          console.error('Caller Function:', callerFunction);
          console.error('Caller Line:', callerLine.trim());
          console.error('SQL Query:', query);
          console.error('SQL Params:', params);
          console.error('Error Details:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage
          });
          console.error('Full Stack Trace:');
          console.error(stack);
          console.error('=== END DATABASE ERROR ===');
          
          // Create enhanced error with context
          const enhancedError = new DatabaseError(
            `Database operation failed in ${callerFunction}: ${err.message}`,
            err
          );
          enhancedError.callerFunction = callerFunction;
          enhancedError.query = query;
          enhancedError.params = params;
          
          reject(enhancedError);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Find a single record by ID
   * @param {number} id - Record ID
   * @param {string} columns - Columns to select (default: *)
   * @returns {Promise<Object|null>} The found record or null
   */
  async findById(id, columns = '*') {
    if (!id) {
      throw new ValidationError('ID is required');
    }

    const query = `SELECT ${columns} FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const results = await this.executeQuery(query, [id]);
    
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find records by condition
   * @param {Object} conditions - Where conditions
   * @param {string} columns - Columns to select
   * @param {Object} options - Additional options (limit, offset, orderBy)
   * @returns {Promise<Array>} Array of found records
   */
  async findBy(conditions = {}, columns = '*', options = {}) {
    const { limit, offset, orderBy } = options;
    
    let query = `SELECT ${columns} FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClauses = Object.keys(conditions).map(key => {
        params.push(conditions[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }
    
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }
    
    return await this.executeQuery(query, params);
  }

  /**
   * Create a new record
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Created record with ID
   */
  async create(data) {
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Data is required for creation');
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const dataWithTimestamps = {
      ...data,
      created_at: now,
      updated_at: now
    };

    const columns = Object.keys(dataWithTimestamps);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => dataWithTimestamps[col]);

    const query = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await this.executeQuery(query, values);
    
    return {
      id: result.insertId,
      ...dataWithTimestamps
    };
  }

  /**
   * Update a record by ID
   * @param {number} id - Record ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated record
   */
  async update(id, data) {
    if (!id) {
      throw new ValidationError('ID is required for update');
    }
    
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Data is required for update');
    }

    // Check if record exists
    const existingRecord = await this.findById(id);
    if (!existingRecord) {
      throw new NotFoundError(`${this.tableName} record with ID ${id}`);
    }

    const dataWithTimestamp = {
      ...data,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const columns = Object.keys(dataWithTimestamp);
    const setClauses = columns.map(col => `${col} = ?`).join(', ');
    const values = [...columns.map(col => dataWithTimestamp[col]), id];

    const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = ?`;
    await this.executeQuery(query, values);
    
    return await this.findById(id);
  }

  /**
   * Delete a record by ID
   * @param {number} id - Record ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    if (!id) {
      throw new ValidationError('ID is required for deletion');
    }

    // Check if record exists
    const existingRecord = await this.findById(id);
    if (!existingRecord) {
      throw new NotFoundError(`${this.tableName} record with ID ${id}`);
    }

    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.executeQuery(query, [id]);
    
    return true;
  }

  /**
   * Soft delete a record (set is_active = false)
   * @param {number} id - Record ID
   * @returns {Promise<Object>} Updated record
   */
  async softDelete(id) {
    return await this.update(id, { is_active: false });
  }

  /**
   * Count records by condition
   * @param {Object} conditions - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(conditions = {}) {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClauses = Object.keys(conditions).map(key => {
        params.push(conditions[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    const results = await this.executeQuery(query, params);
    return results[0].count;
  }

  /**
   * Validate required fields
   * @param {Object} data - Data to validate
   * @param {Array} requiredFields - Array of required field names
   * @throws {ValidationError} If any required field is missing
   */
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => 
      !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
    );
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @throws {ValidationError} If email format is invalid
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  /**
   * Begin a database transaction
   * @returns {Promise} Promise resolving when transaction begins
   */
  async beginTransaction() {
    return new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(new DatabaseError('Failed to begin transaction', err));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Commit a database transaction
   * @returns {Promise} Promise resolving when transaction commits
   */
  async commitTransaction() {
    return new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(new DatabaseError('Failed to commit transaction', err));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Rollback a database transaction
   * @returns {Promise} Promise resolving when transaction rolls back
   */
  async rollbackTransaction() {
    return new Promise((resolve, reject) => {
      db.rollback((err) => {
        if (err) {
          reject(new DatabaseError('Failed to rollback transaction', err));
        } else {
          resolve();
        }
      });
    });
  }
}
