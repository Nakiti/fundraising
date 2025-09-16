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
    if (!designationData || typeof designationData !== 'object') {
      throw new ValidationError('Designation data is required');
    }

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

    // Validate title length and content
    if (designationData.title) {
      if (designationData.title.length > 255) {
        throw new ValidationError('Title must be 255 characters or less');
      }
      if (designationData.title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }
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

    // Validate organization_id if provided
    if (designationData.organization_id) {
      const orgId = parseInt(designationData.organization_id);
      if (isNaN(orgId) || orgId <= 0) {
        throw new ValidationError('Organization ID must be a positive number');
      }
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
    const conditions = { 
      title: title.trim(), 
      organization_id: organizationId 
    };
    
    if (excludeId) {
      // Use dynamic query for exclusion
      const query = 'SELECT id FROM designations WHERE title = ? AND organization_id = ? AND id != ?';
      const results = await this.executeQuery(query, [title.trim(), organizationId, excludeId]);
      return results && results.length > 0;
    }
    
    const results = await this.findBy(conditions, 'id');
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
   * Get designations with dynamic filtering
   * @param {Object} filters - Dynamic filters
   * @param {number} filters.organization_id - Organization ID
   * @param {string} filters.status - Status filter
   * @param {number} filters.goal_min - Minimum goal amount
   * @param {number} filters.goal_max - Maximum goal amount
   * @param {number} filters.raised_min - Minimum raised amount
   * @param {number} filters.raised_max - Maximum raised amount
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Filtered designations
   */
  async getDesignationsWithFilters(filters = {}, options = {}) {
    const { 
      organization_id, 
      status, 
      goal_min, 
      goal_max, 
      raised_min, 
      raised_max,
      ...otherFilters 
    } = filters;

    // Build base conditions
    const conditions = { ...otherFilters };
    if (organization_id) conditions.organization_id = organization_id;
    if (status) conditions.status = status;

    // Build dynamic query for range filters
    let query = `SELECT * FROM designations`;
    const params = [];
    const whereClauses = [];

    // Add basic conditions
    Object.keys(conditions).forEach(key => {
      whereClauses.push(`${key} = ?`);
      params.push(conditions[key]);
    });

    // Add range conditions
    if (goal_min !== undefined) {
      whereClauses.push('goal >= ?');
      params.push(goal_min);
    }
    if (goal_max !== undefined) {
      whereClauses.push('goal <= ?');
      params.push(goal_max);
    }
    if (raised_min !== undefined) {
      whereClauses.push('raised >= ?');
      params.push(raised_min);
    }
    if (raised_max !== undefined) {
      whereClauses.push('raised <= ?');
      params.push(raised_max);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add ordering and pagination
    const { orderBy = 'created_at DESC', limit, offset } = options;
    query += ` ORDER BY ${orderBy}`;
    
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    return await this.executeQuery(query, params);
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
    const designationToCreate = {
      organization_id: designationData.organization_id,
      title: designationData.title.trim(),
      raised: 0,
      goal: designationData.goal || 0,
      donations: 0,
      status: 'active',
      created_by: designationData.created_by,
      updated_by: designationData.updated_by
    };

    // Create designation using BaseService
    return await this.create(designationToCreate);
  }

  /**
   * Update an existing designation
   * @param {number} designationId - Designation ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated designation data
   */
  async updateDesignation(designationId, updateData) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

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

    // Prepare update data with trimmed title
    const dataToUpdate = {
      ...updateData,
      title: updateData.title ? updateData.title.trim() : updateData.title
    };

    // Update designation using BaseService
    return await this.update(designationId, dataToUpdate);
  }

  /**
   * Get designations by organization ID
   * @param {number} organizationId - Organization ID
   * @param {Object} options - Query options
   * @param {boolean} options.activeOnly - Whether to return only active designations
   * @param {string} options.orderBy - Order by clause (default: 'created_at DESC')
   * @param {number} options.limit - Limit results
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Array>} Array of designations
   */
  async getDesignationsByOrganization(organizationId, options = {}) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const { activeOnly = false, orderBy = 'created_at DESC', limit, offset } = options;
    
    const conditions = { organization_id: organizationId };
    if (activeOnly) {
      conditions.status = 'active';
    }

    return await this.findBy(conditions, '*', { orderBy, limit, offset });
  }

  /**
   * Get active designations by organization ID
   * @param {number} organizationId - Organization ID
   * @param {Object} options - Additional query options
   * @returns {Promise<Array>} Array of active designations
   */
  async getActiveDesignations(organizationId, options = {}) {
    return await this.getDesignationsByOrganization(organizationId, { ...options, activeOnly: true });
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
   * Get designation with organization details
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Designation with organization data
   */
  async getDesignationWithDetails(designationId) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

    const query = `
      SELECT 
        d.*,
        o.name as organization_name,
        o.email as organization_email
      FROM designations d
      INNER JOIN organizations o ON d.organization_id = o.id
      WHERE d.id = ?
    `;

    const results = await this.executeQuery(query, [designationId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Designation not found');
    }

    return results[0];
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

    // Delete designation using BaseService
    return await this.delete(designationId);
  }


  /**
   * Update designation totals (raised amount and donation count)
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Updated totals
   */
  async updateDesignationTotals(designationId) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

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

    // Update designation with calculated totals using BaseService
    await this.update(designationId, {
      donations: totals.total_donations,
      raised: parseFloat(totals.total_raised)
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
   * @param {Object} options - Search options
   * @param {boolean} options.activeOnly - Whether to search only active designations
   * @param {string} options.orderBy - Order by clause (default: 'title ASC')
   * @param {number} options.limit - Limit results
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Array>} Array of matching designations
   */
  async searchDesignations(organizationId, searchTerm, options = {}) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      return await this.getDesignationsByOrganization(organizationId, options);
    }

    const { activeOnly = false, orderBy = 'title ASC', limit, offset } = options;
    
    // Build dynamic query with LIKE condition
    let query = `
      SELECT * FROM designations 
      WHERE organization_id = ? AND title LIKE ?
    `;
    let params = [organizationId, `%${searchTerm.trim()}%`];

    if (activeOnly) {
      query += ' AND status = ?';
      params.push('active');
    }

    query += ` ORDER BY ${orderBy}`;
    
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    return await this.executeQuery(query, params);
  }

  /**
   * Get designations by campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Array>} Array of designations associated with the campaign
   */
  async getDesignationsByCampaign(campaignId) {
    if (!campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    const query = `
      SELECT d.* 
      FROM designations d
      JOIN campaign_designations cd ON d.id = cd.designation_id
      WHERE cd.campaign_id = ?
      ORDER BY d.title ASC
    `;

    const results = await this.executeQuery(query, [campaignId]);
    return results || [];
  }

  /**
   * Validate that designation title is unique within organization
   * @param {string} title - Title to check
   * @param {number} organizationId - Organization ID
   * @param {number} excludeId - Designation ID to exclude from check (for updates)
   * @throws {ConflictError} If title already exists
   */
  async validateUniqueTitle(title, organizationId, excludeId = null) {
    if (!title || !organizationId) {
      return;
    }

    const titleExists = await this.checkTitleExists(title, organizationId, excludeId);
    if (titleExists) {
      throw new ConflictError('Designation with this title already exists');
    }
  }

  /**
   * Get designation statistics with enhanced data
   * @param {number} designationId - Designation ID
   * @returns {Promise<Object>} Enhanced designation statistics
   */
  async getDesignationStats(designationId) {
    if (!designationId) {
      throw new ValidationError('Designation ID is required');
    }

    const designation = await this.getDesignation(designationId);
    
    // Get campaign count using this designation
    const campaignCountQuery = `
      SELECT COUNT(*) as campaign_count 
      FROM campaign_designations 
      WHERE designation_id = ?
    `;
    const campaignStats = await this.executeQuery(campaignCountQuery, [designationId]);
    
    // Get recent donations to this designation (last 30 days)
    const recentDonationsQuery = `
      SELECT COUNT(*) as recent_donations, COALESCE(SUM(amount), 0) as recent_amount
      FROM transactions t
      JOIN campaign_designations cd ON t.campaign_id = cd.campaign_id
      WHERE cd.designation_id = ? 
      AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND t.status = 'completed'
    `;
    const recentStats = await this.executeQuery(recentDonationsQuery, [designationId]);

    // Get all-time statistics
    const allTimeStats = await this.updateDesignationTotals(designationId);

    return {
      ...designation,
      campaign_count: campaignStats[0]?.campaign_count || 0,
      recent_donations: recentStats[0]?.recent_donations || 0,
      recent_amount: parseFloat(recentStats[0]?.recent_amount || 0),
      total_donations: allTimeStats.donations,
      total_raised: allTimeStats.raised,
      goal_percentage: designation.goal > 0 ? (designation.raised / designation.goal) * 100 : 0
    };
  }

  /**
   * Get designations with pagination and dynamic filtering
   * @param {number} organizationId - Organization ID
   * @param {Object} options - Pagination and filter options
   * @param {number} options.limit - Number of results per page
   * @param {number} options.offset - Offset for pagination
   * @param {string} options.status - Filter by status
   * @param {string} options.search - Search term for title
   * @param {string} options.orderBy - Order by clause
   * @param {Object} options.filters - Additional dynamic filters
   * @returns {Promise<Object>} Paginated results with metadata
   */
  async getDesignationsPaginated(organizationId, options = {}) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const { 
      limit = 20, 
      offset = 0, 
      status, 
      search, 
      orderBy = 'created_at DESC',
      filters = {}
    } = options;
    
    // Build dynamic conditions
    const conditions = { organization_id: organizationId };
    
    if (status) {
      conditions.status = status;
    }
    
    // Add any additional filters
    Object.assign(conditions, filters);

    // Get total count for pagination
    const total = await this.count(conditions);

    // Get paginated results
    const data = await this.findBy(
      conditions, 
      '*', 
      { orderBy, limit, offset }
    );

    // If search is provided, filter results
    let filteredData = data;
    if (search && search.trim().length > 0) {
      const searchTerm = search.trim().toLowerCase();
      filteredData = data.filter(designation => 
        designation.title.toLowerCase().includes(searchTerm)
      );
    }

    return {
      data: filteredData || [],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Bulk update designation status
   * @param {Array<number>} designationIds - Array of designation IDs
   * @param {string} status - New status
   * @param {number} updatedBy - User ID who updated the designations
   * @returns {Promise<Object>} Update results
   */
  async bulkUpdateStatus(designationIds, status, updatedBy) {
    if (!designationIds || !Array.isArray(designationIds) || designationIds.length === 0) {
      throw new ValidationError('Designation IDs array is required');
    }

    if (!status || !['active', 'inactive'].includes(status)) {
      throw new ValidationError('Status must be either "active" or "inactive"');
    }

    if (!updatedBy) {
      throw new ValidationError('Updated by user ID is required');
    }

    // Check if any designations are in use when deactivating
    if (status === 'inactive') {
      for (const id of designationIds) {
        const inUse = await this.checkDesignationInUse(id);
        if (inUse) {
          throw new ConflictError(`Cannot deactivate designation ID ${id} - it is currently in use`);
        }
      }
    }

    const placeholders = designationIds.map(() => '?').join(',');
    const query = `
      UPDATE designations 
      SET status = ?, updated_at = NOW(), updated_by = ? 
      WHERE id IN (${placeholders})
    `;
    
    const params = [status, updatedBy, ...designationIds];
    const result = await this.executeQuery(query, params);

    return {
      updated: result.affectedRows,
      designationIds: designationIds
    };
  }

  /**
   * Build dynamic query with flexible conditions
   * @param {Object} conditions - Query conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Query results
   */
  async queryDesignations(conditions = {}, options = {}) {
    const { 
      columns = '*', 
      orderBy, 
      limit, 
      offset,
      joins = [],
      groupBy,
      having
    } = options;

    let query = `SELECT ${columns} FROM designations`;
    const params = [];

    // Add joins if specified
    if (joins.length > 0) {
      joins.forEach(join => {
        query += ` ${join.type || 'INNER'} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    // Build WHERE clause
    if (Object.keys(conditions).length > 0) {
      const whereClauses = Object.keys(conditions).map(key => {
        const value = conditions[key];
        if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ');
          params.push(...value);
          return `${key} IN (${placeholders})`;
        } else if (typeof value === 'object' && value.operator) {
          params.push(value.value);
          return `${key} ${value.operator} ?`;
        } else {
          params.push(value);
          return `${key} = ?`;
        }
      });
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add GROUP BY
    if (groupBy) {
      query += ` GROUP BY ${groupBy}`;
    }

    // Add HAVING
    if (having) {
      query += ` HAVING ${having}`;
    }

    // Add ORDER BY
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    // Add LIMIT and OFFSET
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    return await this.executeQuery(query, params);
  }

  /**
   * Get default designation for a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Default designation data
   */
  async getDefaultDesignation(campaignId) {
    if (!campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    const query = `
      SELECT d.*
      FROM designations d
      INNER JOIN campaigns c ON d.id = c.default_designation
      WHERE c.id = ?
    `;

    const results = await this.executeQuery(query, [campaignId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Default designation not found for this campaign');
    }

    return results[0];
  }
}
