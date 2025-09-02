import { BaseService } from '../base/BaseService.js';

/**
 * User Service - Handles all user-related operations including authentication
 * Extends BaseService for common API operations and error handling
 */
export class UserService extends BaseService {
  constructor() {
    super('UserService');
  }

  // ===== USER CRUD OPERATIONS =====

  /**
   * Get user by ID
   */
  async getUser(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/user/get/${userId}`);
  }

  /**
   * Get user data (legacy method for compatibility)
   */
  async getUserData(userId) {
    this.validateId(userId, 'User ID');
    const response = await this.get(`/user/get/${userId}`);
    return response.success ? response.data.user : null;
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    this.validateRequired(userData, 'User data');
    this.validateRequired(userData.email, 'Email');
    this.validateRequired(userData.password, 'Password');
    this.validateEmail(userData.email, 'Email');
    this.validateMinLength(userData.password, 8, 'Password');

    return await this.post('/user/register', userData);
  }

  /**
   * Update an existing user
   */
  async updateUser(userId, updateData) {
    this.validateId(userId, 'User ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/user/update/${userId}`, updateData);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId) {
    this.validateId(userId, 'User ID');
    return await this.delete(`/user/delete/${userId}`);
  }

  // ===== USER AUTHENTICATION =====

  /**
   * User login
   */
  async loginUser(credentials) {
    this.validateRequired(credentials, 'Credentials');
    this.validateRequired(credentials.email, 'Email');
    this.validateRequired(credentials.password, 'Password');
    this.validateEmail(credentials.email, 'Email');

    return await this.post('/user/login', credentials);
  }

  /**
   * User logout
   */
  async logoutUser() {
    return await this.post('/user/logout');
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    return await this.get('/user/current');
  }

  /**
   * Check authentication status
   */
  async checkAuthStatus() {
    return await this.get('/user/auth-status');
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    return await this.post('/user/refresh-token');
  }

  /**
   * Change password
   */
  async changePassword(userId, passwordData) {
    this.validateId(userId, 'User ID');
    this.validateRequired(passwordData.currentPassword, 'Current password');
    this.validateRequired(passwordData.newPassword, 'New password');
    this.validateMinLength(passwordData.newPassword, 8, 'New password');

    return await this.put(`/user/change-password/${userId}`, passwordData);
  }

  /**
   * Reset password request
   */
  async requestPasswordReset(email) {
    this.validateRequired(email, 'Email');
    this.validateEmail(email, 'Email');

    return await this.post('/user/request-password-reset', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    this.validateRequired(token, 'Reset token');
    this.validateRequired(newPassword, 'New password');
    this.validateMinLength(newPassword, 8, 'New password');

    return await this.post('/user/reset-password', { token, newPassword });
  }

  // ===== USER QUERIES =====

  /**
   * Get all users with pagination
   */
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    this.validateRange(page, 1, 1000, 'Page number');
    this.validateRange(limit, 1, 100, 'Limit');

    const params = { page, limit, ...filters };
    return await this.getWithQuery('/user/list', params);
  }

  /**
   * Search users
   */
  async searchUsers(query, filters = {}) {
    this.validateRequired(query, 'Search query');
    
    const params = { q: query, ...filters };
    return await this.getWithQuery('/user/search', params);
  }

  /**
   * Get users by organization
   */
  async getUsersByOrganization(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/user_organization/org/${organizationId}`);
  }

  /**
   * Get pending user organization requests
   */
  async getPendingUserOrganizations(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/user_organization/pending/${organizationId}`);
  }

  // ===== USER ORGANIZATION RELATIONSHIPS =====

  /**
   * Get user organizations (legacy method for compatibility)
   */
  async getUserOrganizations(userId) {
    this.validateId(userId, 'User ID');
    const response = await this.get(`/user_organization/get/${userId}`);
    return response.success ? response.data : [];
  }

  /**
   * Create user organization relationship
   */
  async createUserOrganizationRelation(userId, organizationId, role = 'member') {
    this.validateId(userId, 'User ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(role, ['admin', 'member', 'viewer'], 'Role');

    return await this.post('/user_organization/create', {
      user_id: userId,
      organization_id: organizationId,
      role
    });
  }

  /**
   * Update user organization relationship
   */
  async updateUserOrganizationRelation(userId, organizationId, updateData) {
    this.validateId(userId, 'User ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/user_organization/update/${organizationId}/${userId}`, updateData);
  }

  /**
   * Accept organization invite (legacy method for compatibility)
   */
  async acceptOrganizationInvite(relationId) {
    this.validateId(relationId, 'Relation ID');
    const response = await this.put(`/user_organization/update/${relationId}`);
    return response.success ? (response.data?.success ? null : response.data) : null;
  }

  /**
   * Delete user organization relationship
   */
  async deleteUserOrganizationRelation(userId, organizationId) {
    this.validateId(userId, 'User ID');
    this.validateId(organizationId, 'Organization ID');

    return await this.delete(`/user_organization/delete/${organizationId}/${userId}`);
  }

  // ===== USER PROFILE =====

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/user/profile/${userId}`);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, profileData) {
    this.validateId(userId, 'User ID');
    this.validateRequired(profileData, 'Profile data');

    return await this.put(`/user/profile/${userId}`, profileData);
  }

  /**
   * Upload user avatar
   */
  async uploadUserAvatar(userId, avatarFile) {
    this.validateId(userId, 'User ID');
    this.validateRequired(avatarFile, 'Avatar file');
    this.validateFileType(avatarFile, ['image/jpeg', 'image/png', 'image/webp'], 'Avatar');
    this.validateFileSize(avatarFile, 5, 'Avatar'); // 5MB limit

    const formData = this.createFormData({ avatar: avatarFile });
    return await this.postFormData(`/user/avatar/${userId}`, formData);
  }

  // ===== USER PREFERENCES =====

  /**
   * Get user preferences
   */
  async getUserPreferences(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/user/preferences/${userId}`);
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId, preferences) {
    this.validateId(userId, 'User ID');
    this.validateRequired(preferences, 'Preferences data');

    return await this.put(`/user/preferences/${userId}`, preferences);
  }

  /**
   * Get user notification settings
   */
  async getUserNotificationSettings(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/user/notifications/${userId}`);
  }

  /**
   * Update user notification settings
   */
  async updateUserNotificationSettings(userId, settings) {
    this.validateId(userId, 'User ID');
    this.validateRequired(settings, 'Notification settings');

    return await this.put(`/user/notifications/${userId}`, settings);
  }

  // ===== USER VALIDATION =====

  /**
   * Validate user email uniqueness
   */
  async validateUniqueEmail(email, excludeUserId = null) {
    this.validateRequired(email, 'Email');
    this.validateEmail(email, 'Email');

    const params = { email };
    if (excludeUserId) {
      this.validateId(excludeUserId, 'Exclude user ID');
      params.excludeId = excludeUserId;
    }

    return await this.getWithQuery('/user/validateEmail', params);
  }

  /**
   * Validate username uniqueness
   */
  async validateUniqueUsername(username, excludeUserId = null) {
    this.validateRequired(username, 'Username');
    this.validateMinLength(username, 3, 'Username');
    this.validateMaxLength(username, 30, 'Username');

    const params = { username };
    if (excludeUserId) {
      this.validateId(excludeUserId, 'Exclude user ID');
      params.excludeId = excludeUserId;
    }

    return await this.getWithQuery('/user/validateUsername', params);
  }

  // ===== USER ANALYTICS =====

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/user/stats/${userId}`);
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId, dateRange = '30d') {
    this.validateId(userId, 'User ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/user/activity/${userId}`, { range: dateRange });
  }

  /**
   * Get user contributions
   */
  async getUserContributions(userId, organizationId = null) {
    this.validateId(userId, 'User ID');
    
    const params = {};
    if (organizationId) {
      this.validateId(organizationId, 'Organization ID');
      params.organizationId = organizationId;
    }

    return await this.getWithQuery(`/user/contributions/${userId}`, params);
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update user statuses
   */
  async bulkUpdateStatus(userIds, status) {
    this.validateArray(userIds, 'User IDs');
    this.validateEnum(status, ['active', 'inactive', 'suspended'], 'Status');

    return await this.put('/user/bulkUpdateStatus', {
      userIds,
      status
    });
  }

  /**
   * Bulk delete users
   */
  async bulkDelete(userIds) {
    this.validateArray(userIds, 'User IDs');
    this.validateArrayLength(userIds, 1, 100, 'User IDs');

    return await this.delete('/user/bulkDelete', {
      data: { userIds }
    });
  }

  // ===== USER EXPORT =====

  /**
   * Export user data
   */
  async exportUser(userId, format = 'json') {
    this.validateId(userId, 'User ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/user/export/${userId}`, { format });
  }

  /**
   * Export user activity
   */
  async exportUserActivity(userId, dateRange = '30d', format = 'json') {
    this.validateId(userId, 'User ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/user/exportActivity/${userId}`, {
      range: dateRange,
      format
    });
  }
}
