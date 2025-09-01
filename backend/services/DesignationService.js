import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError,
  DatabaseError 
} from '../utils/errors.js';

/**
 * Designation Service - Handles designation-related business logic
 */
export class DesignationService extends BaseService {
  constructor() {
    super('designations');
  }

  /**
   * Validate designation data
   * @param {Object} designationData - Designation data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateDesignationData(designationData, isUpdate = false) {
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(designationData, [
        'organization_id', 
        'title', 
        'created_by', 
        'updated_by'
      ]);
    } else {
      // Required fields for update
      this.validateRequiredFields(designationData, [
        'title', 
        'updated_by'
      ]);
    }

    // Validate title length
    if (designationData.title && designationData.title.length > 255) {
      throw new ValidationError('Title must be 255 characters or less');
    }

    // Validate goal if provided
    if (designationData.goal !== undefined && designationData.goal !== null) {
      const goal = parseFloat(designationData.goal);
      if (isNaN(goal) || goal < 0) {
        throw new ValidationError('Goal must be a positive number');
      }
    }

    // Validate status if provided
    if (designationData.status && !['active', 'inactive'].includes(designationData.status)) {
      throw new ValidationError('Status must be either "active" or "inactive"');
    }
  }

  /**
   * Check if designation title already exists for organization
   * @param {string} title - Designation title
   * @param {number} organizationId - Organization ID
   * @param {number} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if title exists
   */
  async checkTitleExists(title, organizationId, excludeId = null) {
    let query = 'SELECT id FROM designations WHERE title = ? AND organization_id = ?';
    let params = [title, organizationId];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const results = await this.executeQuery(query, params);
    return results && results.length > 0;
  }

  /**
   * Check if designation is currently in use by campaigns
   * @param {number} designationId - Designation ID
   * @returns {Promise<boolean>} True if designation is in use
   */
  async checkDesignationInUse(designationId) {
    const query = 'SELECT id FROM campaign_designations WHERE designation_id = ? LIMIT 1';
    const results = await this.executeQuery(query, [designationId]);
    return results && results.length > 0;
  }

  /**
   * Create a new designation
   * @param {Object} designationData - Designation data
   * @returns {Promise<Object>} Created designation data
   */
  async createDesignation(designationData) {
    // Validate input data
    this.validateDesignationData(designationData, false);

    // Check for duplicate title within organization
    const titleExists = await this.checkTitleExists(
      designationData.title, 
      designationData.organization_id
    );

    if (titleExists) {
      throw new ConflictError('Designation with this title already exists');
    }

    // Prepare designation data with defaults
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const designationToCreate = {
      organization_id: designationData.organization_id,
      title: designationData.title,
      raised: 0,
      goal: designationData.goal || 0,
      donations: 0,
      status: 'active',
      created_at: now,
      updated_at: now,
      created_by: designationData.created_by,
      updated_by: designationData.updated_by
    };

    // Create designation
    const result = await this.create(designationToCreate);
    
    return {
      id: result.insertId,
      ...designationToCreate
    };
  }

  /**
   * Update an existing designation
   * @param {number} designationId - Designation ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated designation data
   */
  async updateDesignation(designationId, updateData) {
    // Validate input data
    this.validateDesignationData(updateData, true);

    // Check if designation exists
    const existingDesignation = await this.findById(designationId);
    if (!existingDesignation) {
      throw new NotFoundError('Designation not found');
    }

    // Check for duplicate title within organization (excluding current designation)
    if (updateData.title) {
      const titleExists = await this.checkTitleExists(
        updateData.title, 
        existingDesignation.organization_id,
        designationId
      );

      if (titleExists) {
        throw new ConflictError('Designation with this title already exists');
      }
    }

    // If changing status to inactive, check if designation is in use
    if (updateData.status === 'inactive') {
      const inUse = await this.checkDesignationInUse(designationId);
      if (inUse) {
        throw new ConflictError('Cannot deactivate designation that is currently in use');
      }
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Update designation
    await this.update(designationId, dataToUpdate);

    // Return updated designation
    return await this.findById(designationId);
  }

  /**
   * Get designations by organization ID
   * @param {number} organizationId - Organization ID
   * @param {boolean} activeOnly - Whether to return only active designations
   * @returns {Promise<Array>} Array of designations
   */
  async getDesignationsByOrganization(organizationId, activeOnly = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    let query = 'SELECT * FROM designations WHERE organization_id = ?';
    let params = [organizationId];

    if (activeOnly) {
      query += ' AND status = ?';
      params.push('active');
    }

    query += ' ORDER BY created_at DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get active designations by organization ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of active designations
   */
  async getActiveDesignations(organizationId) {
    return await this.getDesignationsByOrganization(organizationId, true);
  }

  /**
   * Get designation by ID
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Designation data
   */
  async getDesignation(designationId) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

    const designation = await this.findById(designationId);
    if (!designation) {
      throw new NotFoundError('Designation not found');
    }

    return designation;
  }

  /**
   * Delete a designation
   * @param {number} designationId - Designation ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteDesignation(designationId) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

    // Check if designation exists
    const designation = await this.findById(designationId);
    if (!designation) {
      throw new NotFoundError('Designation not found');
    }

    // Check if designation is in use
    const inUse = await this.checkDesignationInUse(designationId);
    if (inUse) {
      throw new ConflictError('Cannot delete designation that is currently in use');
    }

    // Delete designation
    const result = await this.delete(designationId);
    return result.affectedRows > 0;
  }

  /**
   * Get designation statistics
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Designation statistics
   */
  async getDesignationStats(designationId) {
    const designation = await this.getDesignation(designationId);
    
    // Get campaign count using this designation
    const campaignCountQuery = `
      SELECT COUNT(*) as campaign_count 
      FROM campaign_designations 
      WHERE designation_id = ?
    `;
    const campaignStats = await this.executeQuery(campaignCountQuery, [designationId]);
    
    // Get recent donations to this designation
    const recentDonationsQuery = `
      SELECT COUNT(*) as recent_donations, COALESCE(SUM(amount), 0) as recent_amount
      FROM transactions t
      JOIN campaign_designations cd ON t.campaign_id = cd.campaign_id
      WHERE cd.designation_id = ? 
      AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    const recentStats = await this.executeQuery(recentDonationsQuery, [designationId]);

    return {
      ...designation,
      campaign_count: campaignStats[0]?.campaign_count || 0,
      recent_donations: recentStats[0]?.recent_donations || 0,
      recent_amount: parseFloat(recentStats[0]?.recent_amount || 0),
      goal_percentage: designation.goal > 0 ? (designation.raised / designation.goal) * 100 : 0
    };
  }

  /**
   * Update designation totals (raised amount and donation count)
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Updated totals
   */
  async updateDesignationTotals(designationId) {
    // Calculate totals from transactions
    const totalsQuery = `
      SELECT 
        COUNT(t.id) as total_donations,
        COALESCE(SUM(t.amount), 0) as total_raised
      FROM transactions t
      JOIN campaign_designations cd ON t.campaign_id = cd.campaign_id
      WHERE cd.designation_id = ?
      AND t.status = 'completed'
    `;
    
    const results = await this.executeQuery(totalsQuery, [designationId]);
    const totals = results[0] || { total_donations: 0, total_raised: 0 };

    // Update designation with calculated totals
    await this.update(designationId, {
      donations: totals.total_donations,
      raised: parseFloat(totals.total_raised),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });

    return {
      donations: totals.total_donations,
      raised: parseFloat(totals.total_raised)
    };
  }

  /**
   * Search designations by title
   * @param {number} organizationId - Organization ID
   * @param {string} searchTerm - Search term
   * @param {boolean} activeOnly - Whether to search only active designations
   * @returns {Promise<Array>} Array of matching designations
   */
  async searchDesignations(organizationId, searchTerm, activeOnly = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      return await this.getDesignationsByOrganization(organizationId, activeOnly);
    }

    let query = `
      SELECT * FROM designations 
      WHERE organization_id = ? 
      AND title LIKE ?
    `;
    let params = [organizationId, `%${searchTerm.trim()}%`];

    if (activeOnly) {
      query += ' AND status = ?';
      params.push('active');
    }

    query += ' ORDER BY title ASC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }
}
