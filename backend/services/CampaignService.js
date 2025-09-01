import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError 
} from '../utils/errors.js';

/**
 * Campaign Service - Handles all campaign-related business logic
 */
export class CampaignService extends BaseService {
  constructor() {
    super('campaigns');
  }

  /**
   * Create a new campaign
   * @param {Object} campaignData - Campaign data
   * @param {number} campaignData.organization_id - Organization ID
   * @param {number} campaignData.created_by - User ID who created the campaign
   * @param {string} campaignData.url - Optional URL slug
   * @returns {Promise<Object>} Created campaign
   */
  async createCampaign(campaignData) {
    const { organization_id, created_by, url } = campaignData;
    
    // Validate required fields
    this.validateRequiredFields(campaignData, ['organization_id', 'created_by']);

    // Check if URL is already taken (if provided)
    if (url) {
      await this.validateUniqueUrl(url);
    }

    const campaignToCreate = {
      organization_id,
      created_by,
      updated_by: created_by,
      url: url || null
    };

    return await this.create(campaignToCreate);
  }

  /**
   * Get campaign with details and creator information
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign with related data
   */
  async getCampaignWithDetails(campaignId) {
    if (!campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    const query = `
      SELECT 
        campaigns.*, 
        campaign_details.*,       
        creator.first_name AS creator_first_name, 
        creator.last_name AS creator_last_name, 
        updater.first_name AS updater_first_name, 
        updater.last_name AS updater_last_name 
      FROM campaigns 
      INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      INNER JOIN users AS creator ON campaigns.created_by = creator.id
      INNER JOIN users AS updater ON campaigns.updated_by = updater.id 
      WHERE campaigns.id = ?
    `;

    const results = await this.executeQuery(query, [campaignId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Campaign');
    }

    return results[0];
  }

  /**
   * Search campaigns by query string
   * @param {string} searchQuery - Search query
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of matching campaigns
   */
  async searchCampaigns(searchQuery, organizationId) {
    if (!searchQuery || !organizationId) {
      throw new ValidationError('Search query and organization ID are required');
    }

    const query = `
      SELECT campaigns.*, 
             campaign_details.internal_name, 
             campaign_details.external_name,
             campaign_details.visits, 
             campaign_details.donations, 
             campaign_details.type, 
             campaign_details.status,
             SUM(transactions.amount) AS amount_raised
      FROM campaigns 
      INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      LEFT JOIN transactions ON campaigns.id = transactions.campaign_id AND transactions.status = 'completed'
      WHERE campaigns.organization_id = ? 
      AND (
        campaign_details.internal_name LIKE ? 
        OR campaign_details.external_name LIKE ?
        OR campaign_details.url LIKE ?
      )
      GROUP BY campaigns.id, campaigns.created_at, campaign_details.internal_name, campaign_details.external_name, campaign_details.visits, campaign_details.donations, campaign_details.type, campaign_details.status
      ORDER BY campaign_details.internal_name ASC
    `;

    const searchTerm = `%${searchQuery}%`;
    return await this.executeQuery(query, [organizationId, searchTerm, searchTerm, searchTerm]);
  }

  /**
   * Get all campaigns for an organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of campaigns
   */
  async getCampaignsByOrganization(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT campaigns.*, 
             campaign_details.internal_name, 
             campaign_details.external_name, 
             campaign_details.visits, 
             campaign_details.donations, 
             campaign_details.type, 
             campaign_details.status, 
             SUM(transactions.amount) AS amount_raised
      FROM campaigns 
      LEFT JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      LEFT JOIN transactions ON campaigns.id = transactions.campaign_id AND transactions.status = 'completed'
      WHERE campaigns.organization_id = ?
      GROUP BY campaigns.id, campaigns.created_at, campaign_details.internal_name, campaign_details.external_name, campaign_details.visits, campaign_details.donations, campaign_details.type, campaign_details.status
      ORDER BY campaigns.created_at DESC
    `;

    return await this.executeQuery(query, [organizationId]);
  }

  /**
   * Get campaigns with filters
   * @param {number} organizationId - Organization ID
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Campaign status
   * @param {Date} filters.startDate - Start date filter
   * @param {Date} filters.endDate - End date filter
   * @param {number} filters.limit - Limit results
   * @param {number} filters.offset - Offset for pagination
   * @returns {Promise<Array>} Array of filtered campaigns
   */
  async getFilteredCampaigns(organizationId, filters = {}) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const { status, type, startDate, endDate, limit = 50, offset = 0 } = filters;
    
    let query = `
      SELECT campaigns.*, 
             campaign_details.internal_name, 
             campaign_details.external_name,
             campaign_details.visits, 
             campaign_details.donations, 
             campaign_details.type, 
             campaign_details.status,
             SUM(transactions.amount) AS amount_raised
      FROM campaigns 
      LEFT JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      LEFT JOIN transactions ON campaigns.id = transactions.campaign_id AND transactions.status = 'completed'
      WHERE campaigns.organization_id = ?
    `;
    const params = [organizationId];

    if (status) {
      query += ` AND campaign_details.status = ?`;
      params.push(status);
    }

    if (type) {
      query += ` AND campaign_details.type = ?`;
      params.push(type);
    }

    if (startDate) {
      query += ` AND campaigns.created_at >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND campaigns.created_at <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY campaigns.id, campaigns.created_at, campaign_details.internal_name, campaign_details.external_name, campaign_details.visits, campaign_details.donations, campaign_details.type, campaign_details.status ORDER BY campaigns.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return await this.executeQuery(query, params);
  }

  /**
   * Update campaign status (updates campaign_details table)
   * @param {number} campaignId - Campaign ID
   * @param {string} status - New status
   * @param {number} updatedBy - User ID who updated the campaign
   * @returns {Promise<Object>} Updated campaign
   */
  async updateCampaignStatus(campaignId, status, updatedBy) {
    if (!campaignId || !status || !updatedBy) {
      throw new ValidationError('Campaign ID, status, and updated_by are required');
    }

    const validStatuses = ['active', 'inactive', 'draft', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Update status in campaign_details table
    const query = `
      UPDATE campaign_details 
      SET status = ?, updated_at = NOW(), updated_by = ? 
      WHERE campaign_id = ?
    `;
    
    await this.executeQuery(query, [status, updatedBy, campaignId]);
    
    // Return the updated campaign with details
    return await this.getCampaignWithDetails(campaignId);
  }

  /**
   * Deactivate a campaign (soft delete)
   * @param {number} campaignId - Campaign ID
   * @param {number} updatedBy - User ID who deactivated the campaign
   * @returns {Promise<Object>} Updated campaign
   */
  async deactivateCampaign(campaignId, updatedBy) {
    return await this.updateCampaignStatus(campaignId, 'inactive', updatedBy);
  }

  /**
   * Check if campaign URL is unique
   * @param {string} url - URL to check
   * @param {number} excludeCampaignId - Campaign ID to exclude from check (for updates)
   * @throws {ConflictError} If URL is already taken
   */
  async validateUniqueUrl(url, excludeCampaignId = null) {
    if (!url) return;

    let query = 'SELECT id FROM campaigns WHERE url = ?';
    const params = [url];

    if (excludeCampaignId) {
      query += ' AND id != ?';
      params.push(excludeCampaignId);
    }

    const results = await this.executeQuery(query, params);
    
    if (results.length > 0) {
      throw new ConflictError('Campaign URL is already in use');
    }
  }

  /**
   * Get campaign statistics
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign statistics
   */
  async getCampaignStats(campaignId) {
    if (!campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    const query = `
      SELECT 
        COUNT(t.id) as total_donations,
        COALESCE(SUM(t.amount), 0) as total_raised,
        COUNT(DISTINCT t.donor_id) as unique_donors,
        AVG(t.amount) as average_donation
      FROM transactions t
      WHERE t.campaign_id = ? AND t.status = 'completed'
    `;

    const results = await this.executeQuery(query, [campaignId]);
    return results[0] || {
      total_donations: 0,
      total_raised: 0,
      unique_donors: 0,
      average_donation: 0
    };
  }

  /**
   * Get campaigns by date range
   * @param {number} organizationId - Organization ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of campaigns in date range
   */
  async getCampaignsByDateRange(organizationId, startDate, endDate) {
    if (!organizationId || !startDate || !endDate) {
      throw new ValidationError('Organization ID, start date, and end date are required');
    }

    const query = `
      SELECT campaigns.*, campaign_details.internal_name, campaign_details.external_name
      FROM campaigns 
      LEFT JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
      WHERE campaigns.organization_id = ? 
      AND campaigns.created_at BETWEEN ? AND ?
      ORDER BY campaigns.created_at DESC
    `;

    return await this.executeQuery(query, [organizationId, startDate, endDate]);
  }

  /**
   * Check if user has permission to access campaign
   * @param {number} campaignId - Campaign ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if user has access
   */
  async userHasAccessToCampaign(campaignId, userId) {
    if (!campaignId || !userId) {
      return false;
    }

    const query = `
      SELECT c.id 
      FROM campaigns c
      INNER JOIN user_organizations uo ON c.organization_id = uo.organization_id
      WHERE c.id = ? AND uo.user_id = ? AND uo.is_active = TRUE
    `;

    const results = await this.executeQuery(query, [campaignId, userId]);
    return results.length > 0;
  }
}
