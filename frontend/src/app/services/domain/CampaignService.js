import { BaseService } from '../base/BaseService.js';
import { ValidationService } from '../base/ValidationService.js';

/**
 * Campaign Service - Handles all campaign-related operations
 * Extends BaseService for common API operations and error handling
 */
export class CampaignService extends BaseService {
  constructor() {
    super('CampaignService');
  }

  // ===== CAMPAIGN CRUD OPERATIONS =====

  /**
   * Get campaign by ID with full details
   */
  async getCampaign(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign/get/${campaignId}`);
  }

  /**
   * Get campaign details (from campaign_details table)
   */
  async getCampaignDetails(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_details/get/${campaignId}`);
  }

  /**
   * Create a new campaign
   */
  async createCampaign(campaignData) {
    this.validateRequired(campaignData, 'Campaign data');
    this.validateRequired(campaignData.name, 'Campaign name');
    this.validateMinLength(campaignData.name, 2, 'Campaign name');
    
    return await this.post('/campaign/create', campaignData);
  }

  /**
   * Update an existing campaign
   */
  async updateCampaign(campaignId, updateData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(updateData, 'Update data');
    
    return await this.put(`/campaign/update/${campaignId}`, updateData);
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.delete(`/campaign/delete/${campaignId}`);
  }

  // ===== CAMPAIGN QUERIES =====

  /**
   * Get all campaigns for an organization
   */
  async getCampaignsByOrganization(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/campaign/org/${organizationId}`);
  }

  /**
   * Search campaigns by query
   */
  async searchCampaigns(query, organizationId) {
    this.validateRequired(query, 'Search query');
    this.validateId(organizationId, 'Organization ID');
    
    return await this.getWithQuery(`/campaign/search/${organizationId}`, { q: query });
  }

  /**
   * Get filtered campaigns by status and type
   */
  async getFilteredCampaigns(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const { status, type, limit, offset } = filters;
    const params = {};
    
    if (status && status !== 'all') params.status = status;
    if (type && type !== 'all') params.type = type;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    
    return await this.getWithQuery(`/campaign/getFiltered/${organizationId}`, params);
  }

  /**
   * Get campaigns by date range
   */
  async getCampaignsByDateRange(start, end, organizationId) {
    this.validateDate(start, 'Start date');
    this.validateDate(end, 'End date');
    this.validateId(organizationId, 'Organization ID');
    
    const startFormatted = this.formatDate(start);
    const endFormatted = this.formatDate(end);
    
    return await this.getWithQuery(`/campaign/daterange/${organizationId}`, {
      start: startFormatted,
      end: endFormatted
    });
  }

  /**
   * Get active campaigns
   */
  async getActiveCampaigns() {
    return await this.get('/campaign/active');
  }

  // ===== CAMPAIGN ANALYTICS =====

  /**
   * Get total amount raised for a campaign
   */
  async getCampaignSumRaised(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign/sumRaised/${campaignId}`);
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign/stats/${campaignId}`);
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignPerformance(campaignId, dateRange = '30d') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/campaign/performance/${campaignId}`, { range: dateRange });
  }

  // ===== CAMPAIGN DESIGNATIONS =====

  /**
   * Get designations for a campaign
   */
  async getCampaignDesignations(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_designation/get/${campaignId}`);
  }

  /**
   * Add designation to campaign
   */
  async addCampaignDesignation(campaignId, designationData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(designationData, 'Designation data');
    
    return await this.post(`/campaign_designation/create`, {
      ...designationData,
      campaign_id: campaignId
    });
  }

  // ===== CAMPAIGN TICKETS =====

  /**
   * Get tickets for a campaign
   */
  async getCampaignTickets(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_ticket/get/${campaignId}`);
  }

  /**
   * Create ticket for campaign
   */
  async createCampaignTicket(campaignId, ticketData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(ticketData, 'Ticket data');
    
    return await this.post(`/campaign_ticket/create`, {
      ...ticketData,
      campaign_id: campaignId
    });
  }

  // ===== CAMPAIGN FAQS =====

  /**
   * Get FAQs for a campaign
   */
  async getCampaignFaqs(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_faq/get/${campaignId}`);
  }

  /**
   * Add FAQ to campaign
   */
  async addCampaignFaq(campaignId, faqData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(faqData.question, 'FAQ question');
    this.validateRequired(faqData.answer, 'FAQ answer');
    
    return await this.post(`/campaign_faq/create`, {
      ...faqData,
      campaign_id: campaignId
    });
  }

  // ===== CAMPAIGN QUESTIONS =====

  /**
   * Get custom questions for a campaign
   */
  async getCampaignQuestions(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_question/get/${campaignId}`);
  }

  /**
   * Add custom question to campaign
   */
  async addCampaignQuestion(campaignId, questionData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(questionData.question, 'Question text');
    this.validateRequired(questionData.type, 'Question type');
    
    return await this.post(`/campaign_question/create`, {
      ...questionData,
      campaign_id: campaignId
    });
  }

  // ===== CAMPAIGN CONTENT OPERATIONS =====

  /**
   * Get custom questions for a campaign
   * @param {string} campaignId - The campaign ID
   * @returns {Promise<Array>} Array of custom questions
   */
  async getCustomQuestions(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    const response = await this.get(`/campaign_question/get/${campaignId}`);
    return response.success ? response.data : [];
  }

  /**
   * Add custom questions to a campaign
   * @param {string} campaignId - The campaign ID
   * @param {Array} questions - Array of questions to add
   * @returns {Promise<Object>} Response from adding questions
   */
  async addCampaignQuestion(campaignId, questions) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(questions, 'Questions');
    this.validateArray(questions, 'Questions');
    
    return await this.post(`/campaign_question/add/${campaignId}`, { questions });
  }

  /**
   * Remove custom questions from a campaign
   * @param {Array} questionIds - Array of question IDs to remove
   * @returns {Promise<Object>} Response from removing questions
   */
  async removeCampaignQuestion(questionIds) {
    this.validateRequired(questionIds, 'Question IDs');
    this.validateArray(questionIds, 'Question IDs');
    
    return await this.delete(`/campaign_question/remove`, { data: { questionIds } });
  }

  /**
   * Get FAQs for a campaign
   * @param {string} campaignId - The campaign ID
   * @returns {Promise<Array>} Array of FAQs
   */
  async getFaqs(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    const response = await this.get(`/faq/get/${campaignId}`);
    return response.success ? response.data : [];
  }

  /**
   * Get campaign tickets
   * @param {string} campaignId - The campaign ID
   * @returns {Promise<Array>} Array of campaign tickets
   */
  async getCampaignTickets(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    const response = await this.get(`/campaign_ticket/get/${campaignId}`);
    return response.success ? response.data : [];
  }

  /**
   * Add tickets to a campaign
   * @param {string} campaignId - The campaign ID
   * @param {Array} tickets - Array of tickets to add
   * @returns {Promise<Object>} Response from adding tickets
   */
  async addCampaignTicket(campaignId, tickets) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(tickets, 'Tickets');
    this.validateArray(tickets, 'Tickets');
    
    return await this.post(`/campaign_ticket/add/${campaignId}`, { tickets });
  }

  /**
   * Remove tickets from a campaign
   * @param {Array} ticketIds - Array of ticket IDs to remove
   * @returns {Promise<Object>} Response from removing tickets
   */
  async removeCampaignTicket(ticketIds) {
    this.validateRequired(ticketIds, 'Ticket IDs');
    this.validateArray(ticketIds, 'Ticket IDs');
    
    return await this.delete(`/campaign_ticket/remove`, { data: { ticketIds } });
  }

  // ===== CAMPAIGN VALIDATION =====

  /**
   * Validate campaign URL uniqueness
   */
  async validateUniqueUrl(url, excludeCampaignId = null) {
    this.validateRequired(url, 'Campaign URL');
    this.validateUrl(url, 'Campaign URL');
    
    const params = { url };
    if (excludeCampaignId) {
      this.validateId(excludeCampaignId, 'Exclude campaign ID');
      params.excludeId = excludeCampaignId;
    }
    
    return await this.getWithQuery('/campaign/validateUrl', params);
  }

  /**
   * Check if campaign name is available
   */
  async isCampaignNameAvailable(name, organizationId, excludeCampaignId = null) {
    this.validateRequired(name, 'Campaign name');
    this.validateId(organizationId, 'Organization ID');
    
    const params = { name, organizationId };
    if (excludeCampaignId) {
      this.validateId(excludeCampaignId, 'Exclude campaign ID');
      params.excludeId = excludeCampaignId;
    }
    
    return await this.getWithQuery('/campaign/validateName', params);
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update campaign statuses
   */
  async bulkUpdateStatus(campaignIds, status) {
    this.validateArray(campaignIds, 'Campaign IDs');
    this.validateEnum(status, ['active', 'inactive', 'draft', 'archived'], 'Status');
    
    return await this.put('/campaign/bulkUpdateStatus', {
      campaignIds,
      status
    });
  }

  /**
   * Bulk delete campaigns
   */
  async bulkDelete(campaignIds) {
    this.validateArray(campaignIds, 'Campaign IDs');
    this.validateArrayLength(campaignIds, 1, 100, 'Campaign IDs');
    
    return await this.delete('/campaign/bulkDelete', {
      data: { campaignIds }
    });
  }

  // ===== CAMPAIGN EXPORT =====

  /**
   * Export campaign data
   */
  async exportCampaign(campaignId, format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/campaign/export/${campaignId}`, { format });
  }

  /**
   * Export campaign analytics
   */
  async exportCampaignAnalytics(campaignId, dateRange = '30d', format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/campaign/exportAnalytics/${campaignId}`, {
      range: dateRange,
      format
    });
  }
}
