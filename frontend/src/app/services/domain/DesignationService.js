import { BaseService } from '../base/BaseService.js';

/**
 * Designation Service - Handles all designation-related operations
 * Extends BaseService for common API operations and error handling
 */
export class DesignationService extends BaseService {
  constructor() {
    super('DesignationService');
  }

  // ===== DESIGNATION CRUD OPERATIONS =====

  /**
   * Get designation by ID
   */
  async getDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/get/${designationId}`);
  }

  /**
   * Create a new designation
   */
  async createDesignation(designationData) {
    this.validateRequired(designationData, 'Designation data');
    this.validateRequired(designationData.title, 'Title');
    this.validateMinLength(designationData.title, 2, 'Title');
    this.validateMaxLength(designationData.title, 255, 'Title');
    this.validateRequired(designationData.organization_id, 'Organization ID');
    this.validateId(designationData.organization_id, 'Organization ID');

    if (designationData.goal_amount) {
      this.validateCurrency(designationData.goal_amount, 'Goal amount');
    }

    return await this.post('/designation/create', designationData);
  }

  /**
   * Update an existing designation
   */
  async updateDesignation(designationId, updateData) {
    this.validateId(designationId, 'Designation ID');
    this.validateRequired(updateData, 'Update data'); 

    if (updateData.title) {
      this.validateMinLength(updateData.title, 2, 'Title');
      this.validateMaxLength(updateData.title, 255, 'Title');
    }

    if (updateData.goal_amount) {
      this.validateCurrency(updateData.goal_amount, 'Goal amount');
    }

    return await this.put(`/designation/update/${designationId}`, updateData);
  }

  /**
   * Delete a designation
   */
  async deleteDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.delete(`/designation/delete/${designationId}`);
  }

  // ===== DESIGNATION QUERIES =====

  /**
   * Get designations by organization
   */
  async getDesignationsByOrganization(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/designation/org/${organizationId}`, params);
  }

  /**
   * Get designations by campaign
   */
  async getDesignationsByCampaign(campaignId, filters = {}) {
    this.validateId(campaignId, 'Campaign ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/designation/campaign/${campaignId}`, params);
  }

  /**
   * Get active designations
   */
  async getActiveDesignations(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/designation/active/${organizationId}`);
  }

  /**
   * Get all designations for an organization
   */
  async getAllDesignations(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/designation/org/${organizationId}`);
  }

  /**
   * Search designations
   */
  async searchDesignations(query, organizationId, filters = {}) {
    this.validateRequired(query, 'Search query');
    this.validateId(organizationId, 'Organization ID');
    
    const params = { q: query, ...filters };
    return await this.getWithQuery(`/designation/search/${organizationId}`, params);
  }

  /**
   * Get designation statistics
   */
  async getDesignationStats(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/stats/${designationId}`);
  }

  // ===== DESIGNATION VALIDATION =====

  /**
   * Validate designation title uniqueness
   */
  async validateUniqueTitle(title, organizationId, excludeDesignationId = null) {
    this.validateRequired(title, 'Title');
    this.validateMinLength(title, 2, 'Title');
    this.validateMaxLength(title, 255, 'Title');
    this.validateId(organizationId, 'Organization ID');

    const params = { title, organizationId };
    if (excludeDesignationId) {
      this.validateId(excludeDesignationId, 'Exclude designation ID');
      params.excludeId = excludeDesignationId;
    }

    return await this.getWithQuery('/designation/validateTitle', params);
  }

  /**
   * Check if designation can be deleted
   */
  async canDeleteDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/canDelete/${designationId}`);
  }

  /**
   * Check if designation can be updated
   */
  async canUpdateDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/canUpdate/${designationId}`);
  }

  // ===== DESIGNATION STATUS =====

  /**
   * Update designation status
   */
  async updateDesignationStatus(designationId, status) {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(status, ['active', 'inactive', 'archived'], 'Status');

    return await this.put(`/designation/status/${designationId}`, { status });
  }

  /**
   * Activate designation
   */
  async activateDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.put(`/designation/activate/${designationId}`);
  }

  /**
   * Deactivate designation
   */
  async deactivateDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.put(`/designation/deactivate/${designationId}`);
  }

  /**
   * Archive designation
   */
  async archiveDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.put(`/designation/archive/${designationId}`);
  }

  // ===== DESIGNATION GOALS =====

  /**
   * Update designation goal
   */
  async updateDesignationGoal(designationId, goalAmount) {
    this.validateId(designationId, 'Designation ID');
    this.validateCurrency(goalAmount, 'Goal amount');

    return await this.put(`/designation/goal/${designationId}`, { goal_amount: goalAmount });
  }

  /**
   * Get designation progress
   */
  async getDesignationProgress(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/progress/${designationId}`);
  }

  /**
   * Calculate designation percentage
   */
  async calculateDesignationPercentage(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/designation/percentage/${designationId}`);
  }

  // ===== DESIGNATION ANALYTICS =====

  /**
   * Get designation performance
   */
  async getDesignationPerformance(designationId, dateRange = '30d') {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/designation/performance/${designationId}`, { range: dateRange });
  }

  /**
   * Get designation trends
   */
  async getDesignationTrends(designationId, period = 'daily', dateRange = '30d') {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(period, ['hourly', 'daily', 'weekly', 'monthly'], 'Period');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/designation/trends/${designationId}`, { period, range: dateRange });
  }

  /**
   * Get designation donor analytics
   */
  async getDesignationDonorAnalytics(designationId, dateRange = '30d') {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/designation/donors/${designationId}`, { range: dateRange });
  }

  // ===== DESIGNATION RELATIONSHIPS =====

  /**
   * Add designation to campaign
   */
  async addDesignationToCampaign(designationId, campaignId) {
    this.validateId(designationId, 'Designation ID');
    this.validateId(campaignId, 'Campaign ID');

    return await this.post('/campaign_designation/create', {
      designation_id: designationId,
      campaign_id: campaignId
    });
  }

  /**
   * Remove designation from campaign
   */
  async removeDesignationFromCampaign(designationId, campaignId) {
    this.validateId(designationId, 'Designation ID');
    this.validateId(campaignId, 'Campaign ID');

    return await this.delete(`/campaign_designation/delete/${campaignId}/${designationId}`);
  }

  /**
   * Get campaigns by designation
   */
  async getCampaignsByDesignation(designationId) {
    this.validateId(designationId, 'Designation ID');
    return await this.get(`/campaign_designation/designation/${designationId}`);
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update designation statuses
   */
  async bulkUpdateStatus(designationIds, status) {
    this.validateArray(designationIds, 'Designation IDs');
    this.validateEnum(status, ['active', 'inactive', 'archived'], 'Status');

    return await this.put('/designation/bulkUpdateStatus', {
      designationIds,
      status
    });
  }

  /**
   * Bulk delete designations
   */
  async bulkDelete(designationIds) {
    this.validateArray(designationIds, 'Designation IDs');
    this.validateArrayLength(designationIds, 1, 100, 'Designation IDs');

    return await this.delete('/designation/bulkDelete', {
      data: { designationIds }
    });
  }

  /**
   * Bulk update designation goals
   */
  async bulkUpdateGoals(designationIds, goalAmount) {
    this.validateArray(designationIds, 'Designation IDs');
    this.validateCurrency(goalAmount, 'Goal amount');

    return await this.put('/designation/bulkUpdateGoals', {
      designationIds,
      goal_amount: goalAmount
    });
  }

  // ===== DESIGNATION EXPORT =====

  /**
   * Export designation data
   */
  async exportDesignation(designationId, format = 'json') {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/designation/export/${designationId}`, { format });
  }

  /**
   * Export designation analytics
   */
  async exportDesignationAnalytics(designationId, dateRange = '30d', format = 'json') {
    this.validateId(designationId, 'Designation ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/designation/exportAnalytics/${designationId}`, {
      range: dateRange,
      format
    });
  }

  // ===== DESIGNATION TEMPLATES =====

  /**
   * Get designation templates
   */
  async getDesignationTemplates(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/designation/templates/${organizationId}`);
  }

  /**
   * Create designation from template
   */
  async createFromTemplate(templateId, organizationId, customizations = {}) {
    this.validateId(templateId, 'Template ID');
    this.validateId(organizationId, 'Organization ID');

    return await this.post('/designation/fromTemplate', {
      template_id: templateId,
      organization_id: organizationId,
      customizations
    });
  }

  /**
   * Save designation as template
   */
  async saveAsTemplate(designationId, templateName) {
    this.validateId(designationId, 'Designation ID');
    this.validateRequired(templateName, 'Template name');
    this.validateMinLength(templateName, 2, 'Template name');

    return await this.post(`/designation/saveAsTemplate/${designationId}`, { name: templateName });
  }

  /**
   * Get default designation for a campaign
   */
  async getDefaultDesignation(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/designation/default/${campaignId}`);
  }
}
