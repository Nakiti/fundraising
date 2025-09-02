import { BaseService } from '../base/BaseService.js';

/**
 * Auth Service - Handles all authentication-related operations
 * Extends BaseService for common API operations and error handling
 */
export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
  }

  // ===== USER AUTHENTICATION OPERATIONS =====

  /**
   * Login user with validation
   */
  async loginUser(inputs) {
    this.validateRequired(inputs, 'Login inputs');
    this.validateRequired(inputs.email, 'Email');
    this.validateEmail(inputs.email);
    this.validateRequired(inputs.password, 'Password');
    
    const response = await this.post('/user/login', inputs);
    console.log('Login response:', response);
    
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    
    return response;
  }

  /**
   * Logout user
   */
  async logoutUser() {
    try {
      const response = await this.post('/user/logout');
      return response;
    } catch (error) {
      // Don't throw error for logout - always clear local state
      return { success: true };
    }
  }

  /**
   * Register user with validation
   */
  async registerUser(userData) {
    this.validateRequired(userData, 'User data');
    this.validateRequired(userData.firstName, 'First Name');
    this.validateMinLength(userData.firstName, 2, 'First Name');
    this.validateRequired(userData.lastName, 'Last Name');
    this.validateMinLength(userData.lastName, 2, 'Last Name');
    this.validateRequired(userData.email, 'Email');
    this.validateEmail(userData.email);
    this.validateRequired(userData.password, 'Password');
    this.validatePassword(userData.password, 8);

    const response = await this.post('/user/create', userData);
    
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    
    return response;
  }

  /**
   * Update password with validation
   */
  async updatePassword(passwordData) {
    this.validateRequired(passwordData, 'Password data');
    this.validateRequired(passwordData.email, 'Email');
    this.validateEmail(passwordData.email);
    this.validateRequired(passwordData.password, 'Password');
    this.validatePassword(passwordData.password, 8);

    const response = await this.put('/user/updatePassword', passwordData);
    
    if (!response.success) {
      throw new Error(response.message || 'Password update failed');
    }
    
    return response;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await this.get('/user/getCurrentUser');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to get current user');
    }
    
    return response;
  }

  /**
   * Check if user is authenticated
   */
  async checkAuthStatus() {
    try {
      const response = await this.getCurrentUser();
      return response.success && response.user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const response = await this.post('/user/refresh');
    
    if (!response.success) {
      throw new Error(response.message || 'Token refresh failed');
    }
    
    return response;
  }

  // ===== PASSWORD VALIDATION =====

  /**
   * Validate password strength
   */
  validatePassword(password, minLength = 8) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a string');
    }
    
    if (password.length < minLength) {
      throw new Error(`Password must be at least ${minLength} characters long`);
    }
    
    // Optional: Add more password strength validation
    // if (!/(?=.*[a-z])/.test(password)) {
    //   throw new Error('Password must contain at least one lowercase letter');
    // }
    // if (!/(?=.*[A-Z])/.test(password)) {
    //   throw new Error('Password must contain at least one uppercase letter');
    // }
    // if (!/(?=.*\d)/.test(password)) {
    //   throw new Error('Password must contain at least one number');
    // }
    
    return true;
  }

  // ===== EMAIL VALIDATION =====

  /**
   * Validate email format
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a string');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    return true;
  }

  // ===== SESSION MANAGEMENT =====

  /**
   * Clear local authentication data
   */
  clearLocalAuth() {
    // This method can be used to clear local storage, cookies, etc.
    // Implementation depends on the frontend storage strategy
    return { success: true };
  }

  /**
   * Set local authentication data
   */
  setLocalAuth(authData) {
    // This method can be used to set local storage, cookies, etc.
    // Implementation depends on the frontend storage strategy
    return { success: true };
  }

  // ===== ERROR HANDLING =====

  /**
   * Handle authentication errors
   */
  handleAuthError(error) {
    if (error.response?.status === 401) {
      // Unauthorized - clear local auth and redirect to login
      this.clearLocalAuth();
      throw new Error('Session expired. Please login again.');
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      throw new Error('Access denied. Insufficient permissions.');
    }
    
    // Re-throw the original error
    throw error;
  }
}
