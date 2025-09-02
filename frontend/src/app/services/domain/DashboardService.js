import { BaseService } from '../base/BaseService.js';

/**
 * Dashboard Service - Handles all dashboard-related operations
 * Extends BaseService for common API operations and error handling
 */
export class DashboardService extends BaseService {
  constructor() {
    super('DashboardService');
  }

  // ===== DASHBOARD SUMMARY OPERATIONS =====

  /**
   * Get dashboard summary statistics for an organization
   * @param {string} organizationId - The organization ID
   * @param {string} period - Time period: 'week', 'month', 'year'
   * @returns {Promise<Object>} Dashboard summary data
   */
  async getDashboardSummary(organizationId, period = 'week') {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(period, ['week', 'month', 'year'], 'Period');

    const response = await this.get(`/dashboard/summary/${organizationId}`, {
      params: { period }
    });

    return response.success ? response.data : null;
  }

  /**
   * Get recent donations for an organization
   * @param {string} organizationId - The organization ID
   * @param {number} limit - Maximum number of donations to return
   * @returns {Promise<Array>} Array of recent donations
   */
  async getRecentDonations(organizationId, limit = 10) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 100, 'Limit');

    const response = await this.get(`/dashboard/recent-donations/${organizationId}`, {
      params: { limit }
    });

    return response.success ? response.data : [];
  }

  /**
   * Get top performing campaigns for an organization
   * @param {string} organizationId - The organization ID
   * @param {number} limit - Maximum number of campaigns to return
   * @returns {Promise<Array>} Array of top campaigns
   */
  async getTopCampaigns(organizationId, limit = 5) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 50, 'Limit');

    const response = await this.get(`/dashboard/top-campaigns/${organizationId}`, {
      params: { limit }
    });

    return response.success ? response.data : [];
  }

  /**
   * Get organization status and health information
   * @param {string} organizationId - The organization ID
   * @returns {Promise<Object>} Organization status data
   */
  async getOrganizationStatus(organizationId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const response = await this.get(`/dashboard/organization-status/${organizationId}`);

    return response.success ? response.data : null;
  }

  /**
   * Get dashboard notifications for an organization
   * @param {string} organizationId - The organization ID
   * @param {number} limit - Maximum number of notifications to return
   * @returns {Promise<Array>} Array of notifications
   */
  async getDashboardNotifications(organizationId, limit = 10) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 100, 'Limit');

    const response = await this.get(`/dashboard/notifications/${organizationId}`, {
      params: { limit }
    });

    return response.success ? response.data : [];
  }

  // ===== ENHANCED DASHBOARD OPERATIONS =====

  /**
   * Get comprehensive dashboard data in a single request
   * @param {string} organizationId - The organization ID
   * @param {Object} options - Dashboard options
   * @param {string} options.period - Time period for summary
   * @param {number} options.donationsLimit - Limit for recent donations
   * @param {number} options.campaignsLimit - Limit for top campaigns
   * @param {number} options.notificationsLimit - Limit for notifications
   * @returns {Promise<Object>} Complete dashboard data
   */
  async getDashboardData(organizationId, options = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      period = 'week',
      donationsLimit = 10,
      campaignsLimit = 5,
      notificationsLimit = 10
    } = options;

    try {
      const [
        summary,
        donations,
        campaigns,
        status,
        notifications
      ] = await Promise.all([
        this.getDashboardSummary(organizationId, period),
        this.getRecentDonations(organizationId, donationsLimit),
        this.getTopCampaigns(organizationId, campaignsLimit),
        this.getOrganizationStatus(organizationId),
        this.getDashboardNotifications(organizationId, notificationsLimit)
      ]);

      return {
        summary,
        donations,
        campaigns,
        status,
        notifications,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logError('Failed to fetch dashboard data', error);
      throw error;
    }
  }

  /**
   * Get dashboard analytics and trends
   * @param {string} organizationId - The organization ID
   * @param {Object} options - Analytics options
   * @param {string} options.startDate - Start date for analytics
   * @param {string} options.endDate - End date for analytics
   * @param {string} options.groupBy - Grouping: 'day', 'week', 'month'
   * @returns {Promise<Object>} Analytics data
   */
  async getDashboardAnalytics(organizationId, options = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      startDate,
      endDate,
      groupBy = 'week'
    } = options;

    if (startDate && endDate) {
      this.validateDate(startDate, 'Start Date');
      this.validateDate(endDate, 'End Date');
      this.validateDateRange(startDate, endDate);
    }

    this.validateEnum(groupBy, ['day', 'week', 'month'], 'Group By');

    const response = await this.get(`/dashboard/analytics/${organizationId}`, {
      params: { startDate, endDate, groupBy }
    });

    return response.success ? response.data : null;
  }

  /**
   * Get dashboard performance metrics
   * @param {string} organizationId - The organization ID
   * @param {string} period - Time period for metrics
   * @returns {Promise<Object>} Performance metrics
   */
  async getDashboardMetrics(organizationId, period = 'week') {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(period, ['week', 'month', 'year'], 'Period');

    const response = await this.get(`/dashboard/metrics/${organizationId}`, {
      params: { period }
    });

    return response.success ? response.data : null;
  }

  /**
   * Get dashboard insights and recommendations
   * @param {string} organizationId - The organization ID
   * @returns {Promise<Object>} Insights and recommendations
   */
  async getDashboardInsights(organizationId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const response = await this.get(`/dashboard/insights/${organizationId}`);

    return response.success ? response.data : null;
  }

  // ===== DASHBOARD CUSTOMIZATION =====

  /**
   * Get user's dashboard preferences
   * @param {string} organizationId - The organization ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Dashboard preferences
   */
  async getDashboardPreferences(organizationId, userId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(userId, 'User ID');
    this.validateId(userId, 'User ID');

    const response = await this.get(`/dashboard/preferences/${organizationId}/${userId}`);

    return response.success ? response.data : null;
  }

  /**
   * Update user's dashboard preferences
   * @param {string} organizationId - The organization ID
   * @param {string} userId - The user ID
   * @param {Object} preferences - Dashboard preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updateDashboardPreferences(organizationId, userId, preferences) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(userId, 'User ID');
    this.validateId(userId, 'User ID');
    this.validateRequired(preferences, 'Preferences');

    const response = await this.put(`/dashboard/preferences/${organizationId}/${userId}`, preferences);

    return response.success ? response.data : null;
  }

  // ===== DASHBOARD EXPORT OPERATIONS =====

  /**
   * Export dashboard data to various formats
   * @param {string} organizationId - The organization ID
   * @param {Object} options - Export options
   * @param {string} options.format - Export format: 'csv', 'pdf', 'excel'
   * @param {string} options.period - Time period for export
   * @param {Array} options.dataTypes - Types of data to export
   * @returns {Promise<Object>} Export result
   */
  async exportDashboardData(organizationId, options = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      format = 'csv',
      period = 'month',
      dataTypes = ['summary', 'donations', 'campaigns']
    } = options;

    this.validateEnum(format, ['csv', 'pdf', 'excel'], 'Export Format');
    this.validateEnum(period, ['week', 'month', 'year'], 'Period');
    this.validateArray(dataTypes, 'Data Types');

    const response = await this.post(`/dashboard/export/${organizationId}`, {
      format,
      period,
      dataTypes
    });

    return response.success ? response.data : null;
  }

  // ===== VALIDATION HELPERS =====

  /**
   * Validate date format
   */
  validateDate(dateString, fieldName) {
    if (!dateString || typeof dateString !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} must be a valid date`);
    }

    return true;
  }

  /**
   * Validate date range (start date must be before end date)
   */
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error('Start date must be before end date');
    }

    return true;
  }

  /**
   * Validate array
   */
  validateArray(value, fieldName) {
    if (!Array.isArray(value)) {
      throw new Error(`${fieldName} must be an array`);
    }

    return true;
  }

  /**
   * Validate enum value
   */
  validateEnum(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
      throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }

    return true;
  }
}
