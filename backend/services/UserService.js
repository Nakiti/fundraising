import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError,
  AuthenticationError,
  ConflictError
} from '../utils/errors.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * User Service - Handles user account management and authentication
 * Manages user accounts, authentication, and profile operations
 */
export class UserService extends BaseService {
  constructor() {
    super('users');
  }

  /**
   * Valid user roles
   */
  static VALID_ROLES = ['user', 'admin', 'owner', 'moderator'];

  /**
   * Password requirements
   */
  static PASSWORD_MIN_LENGTH = 8;
  static PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  /**
   * Email validation regex
   */
  static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validate user data
   * @param {Object} userData - User data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateUserData(userData, isUpdate = false) {
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(userData, [
        'first_name', 
        'last_name', 
        'email', 
        'password'
      ]);
    }

    // Validate email format
    if (userData.email && !UserService.EMAIL_REGEX.test(userData.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    if (userData.password) {
      if (userData.password.length < UserService.PASSWORD_MIN_LENGTH) {
        throw new ValidationError(`Password must be at least ${UserService.PASSWORD_MIN_LENGTH} characters long`);
      }
      
      if (!UserService.PASSWORD_REGEX.test(userData.password)) {
        throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      }
    }

    // Validate role
    if (userData.role && !UserService.VALID_ROLES.includes(userData.role)) {
      throw new ValidationError(`Role must be one of: ${UserService.VALID_ROLES.join(', ')}`);
    }

    // Validate name fields
    if (userData.first_name && userData.first_name.trim().length < 2) {
      throw new ValidationError('First name must be at least 2 characters long');
    }

    if (userData.last_name && userData.last_name.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters long');
    }

    // Validate email length
    if (userData.email && userData.email.length > 255) {
      throw new ValidationError('Email address is too long');
    }
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {string} Hashed password
   */
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {boolean} Whether passwords match
   */
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        organization_id: user.organization_id,
        email: user.email,
        role: user.role || 'user'
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new AuthenticationError('Token is not valid');
    }
  }

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @param {number} excludeUserId - User ID to exclude from check (for updates)
   * @returns {Promise<boolean>} Whether email exists
   */
  async emailExists(email, excludeUserId = null) {
    let query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const params = [email];

    if (excludeUserId) {
      query += ' AND id != ?';
      params.push(excludeUserId);
    }

    const results = await this.executeQuery(query, params);
    return results && results[0] && results[0].count > 0;
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data without password
   */
  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await this.executeQuery(query, [email]);

    if (!results || results.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = results[0];
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordCorrect = this.comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    // Return user data without password
    const { password: userPassword, ...userData } = user;
    return {
      user: userData,
      token
    };
  }

  /**
   * Get current user by token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(token) {
    if (!token) {
      throw new AuthenticationError('Not authenticated');
    }

    // Verify token
    const decoded = this.verifyToken(token);

    // Get user data from database
    const query = 'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?';
    const results = await this.executeQuery(query, [decoded.id]);

    if (!results || results.length === 0) {
      throw new NotFoundError('User not found');
    }

    const userData = results[0];
    if (!userData) {
      throw new NotFoundError('User not found');
    }

    return { user: userData };
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    // Validate input data
    this.validateUserData(userData, false);

    // Check if email already exists
    const emailExists = await this.emailExists(userData.email);
    if (emailExists) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = this.hashPassword(userData.password);

    // Prepare user data
    const userToCreate = {
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      role: userData.role || 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create user
    const result = await this.create(userToCreate);
    
    // Return user data without password
    const { password, ...userWithoutPassword } = userToCreate;
    return {
      id: result.insertId,
      ...userWithoutPassword
    };
  }

  /**
   * Update user password
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async updatePassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new ValidationError('Email and password are required');
    }

    // Validate password strength
    if (newPassword.length < UserService.PASSWORD_MIN_LENGTH) {
      throw new ValidationError(`Password must be at least ${UserService.PASSWORD_MIN_LENGTH} characters long`);
    }

    if (!UserService.PASSWORD_REGEX.test(newPassword)) {
      throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // Hash new password
    const hashedPassword = this.hashPassword(newPassword);

    // Update password
    const query = 'UPDATE users SET password = ?, updated_at = ? WHERE email = ?';
    const result = await this.executeQuery(query, [hashedPassword, new Date(), email]);

    if (!result || result.affectedRows === 0) {
      throw new NotFoundError('User not found');
    }

    return true;
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUser(userId) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const query = 'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?';
    const results = await this.executeQuery(query, [userId]);

    if (!results || results.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = results[0];
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return { user };
  }

  /**
   * Get users by organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of organization users
   */
  async getUsersByOrganization(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        users.id, 
        users.first_name, 
        users.last_name, 
        users.email, 
        users.organization_id, 
        users.role, 
        users.created_at,
        user_organizations.status as org_status
      FROM user_organizations
      JOIN users ON users.id = user_organizations.user_id
      WHERE organization_id = ?
      ORDER BY users.created_at DESC
    `;

    const results = await this.executeQuery(query, [organizationId]);
    return { users: results || [] };
  }

  /**
   * Update user
   * @param {number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, updateData) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Validate input data
    this.validateUserData(updateData, true);

    // Check if user exists
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateData.email) {
      const emailExists = await this.emailExists(updateData.email, userId);
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = this.hashPassword(updateData.password);
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date()
    };

    // Update user
    await this.update(userId, dataToUpdate);

    // Return updated user data
    return await this.getUser(userId);
  }

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserRole(userId, role) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!role) {
      throw new ValidationError('Role is required');
    }

    if (!UserService.VALID_ROLES.includes(role)) {
      throw new ValidationError(`Role must be one of: ${UserService.VALID_ROLES.join(', ')}`);
    }

    return await this.updateUser(userId, { role });
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Check if user exists
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Delete user
    await this.delete(userId);
    return true;
  }

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @param {number} organizationId - Optional organization filter
   * @returns {Promise<Array>} Array of matching users
   */
  async searchUsers(searchTerm, organizationId = null) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new ValidationError('Search term is required');
    }

    let query = `
      SELECT 
        users.id, 
        users.first_name, 
        users.last_name, 
        users.email, 
        users.role, 
        users.created_at
      FROM users
    `;

    const params = [];
    const conditions = [];

    // Add search conditions
    const searchPattern = `%${searchTerm.trim()}%`;
    conditions.push('(users.first_name LIKE ? OR users.last_name LIKE ? OR users.email LIKE ?)');
    params.push(searchPattern, searchPattern, searchPattern);

    // Add organization filter if provided
    if (organizationId) {
      query += ' JOIN user_organizations ON users.id = user_organizations.user_id';
      conditions.push('user_organizations.organization_id = ?');
      params.push(organizationId);
    }

    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY users.created_at DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get user statistics
   * @param {number} organizationId - Optional organization filter
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats(organizationId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owner_users,
        COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderator_users,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30_days,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_7_days
      FROM users
    `;

    const params = [];

    if (organizationId) {
      query += ' JOIN user_organizations ON users.id = user_organizations.user_id';
      query += ' WHERE user_organizations.organization_id = ?';
      params.push(organizationId);
    }

    const results = await this.executeQuery(query, params);
    const stats = results[0] || {};

    return {
      total_users: parseInt(stats.total_users) || 0,
      admin_users: parseInt(stats.admin_users) || 0,
      owner_users: parseInt(stats.owner_users) || 0,
      moderator_users: parseInt(stats.moderator_users) || 0,
      regular_users: parseInt(stats.regular_users) || 0,
      new_users_30_days: parseInt(stats.new_users_30_days) || 0,
      new_users_7_days: parseInt(stats.new_users_7_days) || 0
    };
  }

  /**
   * Bulk create users
   * @param {Array<Object>} usersData - Array of user data
   * @returns {Promise<Array>} Array of creation results
   */
  async bulkCreateUsers(usersData) {
    if (!Array.isArray(usersData) || usersData.length === 0) {
      throw new ValidationError('Users data array is required and cannot be empty');
    }

    const results = [];

    for (const userData of usersData) {
      try {
        const createdUser = await this.createUser(userData);
        results.push({
          success: true,
          user: createdUser
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          email: userData.email
        });
      }
    }

    return results;
  }

  /**
   * Reset user password
   * @param {string} email - User email
   * @returns {Promise<string>} Reset token
   */
  async resetPassword(email) {
    if (!email) {
      throw new ValidationError('Email is required');
    }

    // Check if user exists
    const query = 'SELECT id FROM users WHERE email = ?';
    const results = await this.executeQuery(query, [email]);

    if (!results || results.length === 0) {
      throw new NotFoundError('User not found');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email, type: 'password_reset' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // Store reset token (you might want to add a reset_token field to users table)
    // For now, we'll just return the token
    return resetToken;
  }

  /**
   * Verify reset token and update password
   * @param {string} resetToken - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async verifyResetTokenAndUpdatePassword(resetToken, newPassword) {
    if (!resetToken || !newPassword) {
      throw new ValidationError('Reset token and new password are required');
    }

    try {
      // Verify reset token
      const decoded = jwt.verify(resetToken, config.jwt.secret);
      
      if (decoded.type !== 'password_reset') {
        throw new AuthenticationError('Invalid reset token');
      }

      // Update password
      return await this.updatePassword(decoded.email, newPassword);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Invalid or expired reset token');
      }
      throw error;
    }
  }
}
