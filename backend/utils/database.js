import { db } from "../db.js";
import { DatabaseError, NotFoundError } from "./errors.js";

/**
 * Database utility wrapper for consistent error handling
 */
export class DatabaseUtils {
  /**
   * Execute a database query with proper error handling
   */
  static query(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          reject(new DatabaseError('Database operation failed', err));
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Execute a SELECT query and return single result
   */
  static async findOne(sql, params = []) {
    const results = await this.query(sql, params);
    if (!results || results.length === 0) {
      throw new NotFoundError('Record');
    }
    return results[0];
  }

  /**
   * Execute a SELECT query and return all results
   */
  static async findAll(sql, params = []) {
    return await this.query(sql, params);
  }

  /**
   * Execute an INSERT query
   */
  static async insert(sql, params = []) {
    const result = await this.query(sql, params);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  }

  /**
   * Execute an UPDATE query
   */
  static async update(sql, params = []) {
    const result = await this.query(sql, params);
    if (result.affectedRows === 0) {
      throw new NotFoundError('Record');
    }
    return {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  }

  /**
   * Execute a DELETE query
   */
  static async delete(sql, params = []) {
    const result = await this.query(sql, params);
    if (result.affectedRows === 0) {
      throw new NotFoundError('Record');
    }
    return {
      affectedRows: result.affectedRows
    };
  }

  /**
   * Execute a transaction
   */
  static async transaction(callback) {
    return new Promise((resolve, reject) => {
      db.beginTransaction(async (err) => {
        if (err) {
          reject(new DatabaseError('Failed to start transaction', err));
          return;
        }

        try {
          const result = await callback();
          
          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => {
                reject(new DatabaseError('Failed to commit transaction', commitErr));
              });
            } else {
              resolve(result);
            }
          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    });
  }

  /**
   * Check if a record exists
   */
  static async exists(sql, params = []) {
    const results = await this.query(sql, params);
    return results && results.length > 0;
  }

  /**
   * Count records
   */
  static async count(sql, params = []) {
    const results = await this.query(sql, params);
    return results[0]?.count || 0;
  }

  /**
   * Paginate results
   */
  static async paginate(sql, params = [], page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const paginatedSql = `${sql} LIMIT ${limit} OFFSET ${offset}`;
    
    const [results, totalResults] = await Promise.all([
      this.query(paginatedSql, params),
      this.count(`SELECT COUNT(*) as count FROM (${sql}) as subquery`, params)
    ]);

    return {
      data: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResults / limit),
        totalItems: totalResults,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(totalResults / limit),
        hasPrevPage: page > 1
      }
    };
  }
}

/**
 * Helper functions for common database operations
 */
export const dbHelpers = {
  /**
   * Create a new record
   */
  async create(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    return await DatabaseUtils.insert(sql, values);
  },

  /**
   * Find a record by ID
   */
  async findById(table, id, columns = '*') {
    const sql = `SELECT ${columns} FROM ${table} WHERE id = ?`;
    return await DatabaseUtils.findOne(sql, [id]);
  },

  /**
   * Find a record by field
   */
  async findByField(table, field, value, columns = '*') {
    const sql = `SELECT ${columns} FROM ${table} WHERE ${field} = ?`;
    return await DatabaseUtils.findOne(sql, [value]);
  },

  /**
   * Find all records
   */
  async findAll(table, columns = '*', where = '', params = []) {
    const sql = `SELECT ${columns} FROM ${table} ${where}`;
    return await DatabaseUtils.findAll(sql, params);
  },

  /**
   * Update a record by ID
   */
  async updateById(table, id, data) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    return await DatabaseUtils.update(sql, values);
  },

  /**
   * Delete a record by ID
   */
  async deleteById(table, id) {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    return await DatabaseUtils.delete(sql, [id]);
  },

  /**
   * Soft delete a record (set deleted_at field)
   */
  async softDelete(table, id) {
    const sql = `UPDATE ${table} SET deleted_at = NOW() WHERE id = ?`;
    return await DatabaseUtils.update(sql, [id]);
  }
};
