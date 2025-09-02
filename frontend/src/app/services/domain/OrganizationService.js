import { BaseService } from '../base/BaseService.js';

/**
 * Organization Service - Handles all organization-related operations
 * Extends BaseService for common API operations and error handling
 */
export class OrganizationService extends BaseService {
  constructor() {
    super('OrganizationService');
  }

  // ===== ORGANIZATION CRUD OPERATIONS =====

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization/get/${organizationId}`);
  }

  /**
   * Create a new organization
   */
  async createOrganization(organizationData, userId) {
    this.validateRequired(organizationData, 'Organization data');
    this.validateRequired(organizationData.name, 'Organization name');
    this.validateMinLength(organizationData.name, 2, 'Organization name');
    this.validateId(userId, 'User ID');

    return await this.post('/organization/register', {
      ...organizationData,
      userId: userId
    });
  }

  /**
   * Update an existing organization
   */
  async updateOrganization(organizationId, updateData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/organization/update/${organizationId}`, updateData);
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.delete(`/organization/delete/${organizationId}`);
  }

  // ===== ORGANIZATION QUERIES =====

  /**
   * Get organizations by user
   */
  async getOrganizationsByUser(userId) {
    this.validateId(userId, 'User ID');
    return await this.get(`/organization/user/${userId}`);
  }

  /**
   * Search organizations
   */
  async searchOrganizations(query, filters = {}) {
    this.validateRequired(query, 'Search query');
    
    const params = { q: query, ...filters };
    return await this.getWithQuery('/organization/search', params);
  }

  /**
   * Get organizations with pagination
   */
  async getOrganizations(page = 1, limit = 10, filters = {}) {
    this.validateRange(page, 1, 1000, 'Page number');
    this.validateRange(limit, 1, 100, 'Limit');

    const params = { page, limit, ...filters };
    return await this.getWithQuery('/organization/list', params);
  }

  /**
   * Get organization statistics
   */
  async getOrganizationStats(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization/stats/${organizationId}`);
  }

  // ===== ORGANIZATION STATUS =====

  /**
   * Get organization activation status
   */
  async getOrganizationStatus(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization_status/get/${organizationId}`);
  }

  /**
   * Check organization activation requirements
   */
  async checkActivationRequirements(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization_status/requirements/${organizationId}`);
  }

  /**
   * Update organization status
   */
  async updateOrganizationStatus(organizationId, status) {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(status, ['active', 'inactive', 'pending'], 'Status');

    return await this.put(`/organization_status/update/${organizationId}`, { status });
  }

  // ===== ORGANIZATION MEMBERS =====

  /**
   * Get organization members
   */
  async getOrganizationMembers(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/user_organization/org/${organizationId}`);
  }

  /**
   * Add member to organization
   */
  async addOrganizationMember(organizationId, userData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(userData.email, 'User email');
    this.validateEmail(userData.email, 'User email');

    return await this.post('/user_organization/create', {
      ...userData,
      organization_id: organizationId
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(organizationId, userId, role) {
    this.validateId(organizationId, 'Organization ID');
    this.validateId(userId, 'User ID');
    this.validateEnum(role, ['admin', 'member', 'viewer'], 'Role');

    return await this.put(`/user_organization/update/${organizationId}/${userId}`, { role });
  }

  /**
   * Remove member from organization
   */
  async removeOrganizationMember(organizationId, userId) {
    this.validateId(organizationId, 'Organization ID');
    this.validateId(userId, 'User ID');

    return await this.delete(`/user_organization/delete/${organizationId}/${userId}`);
  }

  // ===== ORGANIZATION INVITATIONS =====

  /**
   * Get pending invitations
   */
  async getPendingInvitations(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/user_organization/pending/${organizationId}`);
  }

  /**
   * Send invitation
   */
  async sendInvitation(organizationId, invitationData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(invitationData.email, 'Email');
    this.validateEmail(invitationData.email, 'Email');

    return await this.post('/user_organization/invite', {
      ...invitationData,
      organization_id: organizationId
    });
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(invitationToken) {
    this.validateRequired(invitationToken, 'Invitation token');

    return await this.post('/user_organization/accept', { token: invitationToken });
  }

  /**
   * Decline invitation
   */
  async declineInvitation(invitationToken) {
    this.validateRequired(invitationToken, 'Invitation token');

    return await this.post('/user_organization/decline', { token: invitationToken });
  }

  // ===== ORGANIZATION SETTINGS =====

  /**
   * Get organization settings
   */
  async getOrganizationSettings(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization/settings/${organizationId}`);
  }

  /**
   * Update organization settings
   */
  async updateOrganizationSettings(organizationId, settings) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(settings, 'Settings data');

    return await this.put(`/organization/settings/${organizationId}`, settings);
  }

  /**
   * Get organization theme
   */
  async getOrganizationTheme(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/organization/theme/${organizationId}`);
  }

  /**
   * Update organization theme
   */
  async updateOrganizationTheme(organizationId, themeData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(themeData, 'Theme data');

    return await this.put(`/organization/theme/${organizationId}`, themeData);
  }

  // ===== ORGANIZATION VALIDATION =====

  /**
   * Validate organization name uniqueness
   */
  async validateUniqueName(name, excludeOrganizationId = null) {
    this.validateRequired(name, 'Organization name');
    this.validateMinLength(name, 2, 'Organization name');

    const params = { name };
    if (excludeOrganizationId) {
      this.validateId(excludeOrganizationId, 'Exclude organization ID');
      params.excludeId = excludeOrganizationId;
    }

    return await this.getWithQuery('/organization/validateName', params);
  }

  /**
   * Validate organization URL uniqueness
   */
  async validateUniqueUrl(url, excludeOrganizationId = null) {
    this.validateRequired(url, 'Organization URL');
    this.validateUrl(url, 'Organization URL');

    const params = { url };
    if (excludeOrganizationId) {
      this.validateId(excludeOrganizationId, 'Exclude organization ID');
      params.excludeId = excludeOrganizationId;
    }

    return await this.getWithQuery('/organization/validateUrl', params);
  }

  // ===== ORGANIZATION ANALYTICS =====

  /**
   * Get organization dashboard data
   */
  async getDashboardData(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/organization/dashboard/${organizationId}`, { range: dateRange });
  }

  /**
   * Get organization growth metrics
   */
  async getGrowthMetrics(organizationId, period = 'monthly') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(period, ['daily', 'weekly', 'monthly', 'yearly'], 'Period');

    return await this.getWithQuery(`/organization/growth/${organizationId}`, { period });
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update organization statuses
   */
  async bulkUpdateStatus(organizationIds, status) {
    this.validateArray(organizationIds, 'Organization IDs');
    this.validateEnum(status, ['active', 'inactive', 'pending'], 'Status');

    return await this.put('/organization/bulkUpdateStatus', {
      organizationIds,
      status
    });
  }

  /**
   * Bulk delete organizations
   */
  async bulkDelete(organizationIds) {
    this.validateArray(organizationIds, 'Organization IDs');
    this.validateArrayLength(organizationIds, 1, 100, 'Organization IDs');

    return await this.delete('/organization/bulkDelete', {
      data: { organizationIds }
    });
  }

  // ===== ORGANIZATION EXPORT =====

  /**
   * Export organization data
   */
  async exportOrganization(organizationId, format = 'json') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/organization/export/${organizationId}`, { format });
  }

  /**
   * Export organization analytics
   */
  async exportOrganizationAnalytics(organizationId, dateRange = '30d', format = 'json') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/organization/exportAnalytics/${organizationId}`, {
      range: dateRange,
      format
    });
  }
}
