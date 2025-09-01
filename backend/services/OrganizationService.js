import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError 
} from '../utils/errors.js';

/**
 * Organization Service - Handles all organization-related business logic
 */
export class OrganizationService extends BaseService {
  constructor() {
    super('organizations');
  }

  /**
   * Register a new organization
   * @param {Object} organizationData - Organization data
   * @param {string} organizationData.name - Organization name
   * @param {string} organizationData.email - Organization email
   * @param {number} organizationData.userId - User ID who created the organization
   * @param {string} organizationData.address - Optional address
   * @param {string} organizationData.city - Optional city
   * @param {string} organizationData.state - Optional state
   * @param {string} organizationData.country - Optional country
   * @param {string} organizationData.zip - Optional zip code
   * @returns {Promise<Object>} Created organization
   */
  async registerOrganization(organizationData) {
    const { name, email, userId, address, city, state, country, zip } = organizationData;
    
    // Validate required fields
    this.validateRequiredFields(organizationData, ['name', 'email', 'userId']);
    this.validateEmail(email);

    // Check if organization already exists with this email
    await this.validateUniqueEmail(email);

    const organizationToCreate = {
      name,
      email,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      zip: zip || null,
      created_by: userId,
      updated_by: userId
    };

    return await this.create(organizationToCreate);
  }

  /**
   * Get organization by ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Organization data
   */
  async getOrganization(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const organization = await this.findById(organizationId);
    
    if (!organization) {
      throw new NotFoundError('Organization');
    }

    return organization;
  }

  /**
   * Update organization
   * @param {number} organizationId - Organization ID
   * @param {Object} updateData - Data to update
   * @param {number} updatedBy - User ID who updated the organization
   * @returns {Promise<Object>} Updated organization
   */
  async updateOrganization(organizationId, updateData, updatedBy) {
    const { name, address, city, state, country, zip } = updateData;
    
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }
    
    if (!name || !updatedBy) {
      throw new ValidationError('Missing required fields: name, updated_by');
    }

    const dataToUpdate = {
      name,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      zip: zip || null,
      updated_by: updatedBy
    };

    return await this.update(organizationId, dataToUpdate);
  }

  /**
   * Get organizations by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of organizations the user has access to
   */
  async getOrganizationsByUser(userId) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const query = `
      SELECT o.*, uo.role, uo.is_active as user_active
      FROM organizations o
      INNER JOIN user_organizations uo ON o.id = uo.organization_id
      WHERE uo.user_id = ? AND uo.is_active = TRUE
      ORDER BY o.name ASC
    `;

    return await this.executeQuery(query, [userId]);
  }

  /**
   * Get organization with member count
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Organization with member statistics
   */
  async getOrganizationWithStats(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        o.*,
        COUNT(DISTINCT uo.user_id) as member_count,
        COUNT(DISTINCT c.id) as campaign_count,
        COUNT(DISTINCT d.id) as donor_count
      FROM organizations o
      LEFT JOIN user_organizations uo ON o.id = uo.organization_id AND uo.is_active = TRUE
      LEFT JOIN campaigns c ON o.id = c.organization_id
      LEFT JOIN donors d ON o.id = d.organization_id AND d.is_active = TRUE
      WHERE o.id = ?
      GROUP BY o.id
    `;

    const results = await this.executeQuery(query, [organizationId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Organization');
    }

    return results[0];
  }

  /**
   * Check if user has access to organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object|null>} User organization relationship or null
   */
  async getUserOrganizationAccess(userId, organizationId) {
    if (!userId || !organizationId) {
      throw new ValidationError('User ID and Organization ID are required');
    }

    const query = `
      SELECT uo.*, o.name as organization_name
      FROM user_organizations uo
      INNER JOIN organizations o ON uo.organization_id = o.id
      WHERE uo.user_id = ? AND uo.organization_id = ? AND uo.is_active = TRUE
    `;

    const results = await this.executeQuery(query, [userId, organizationId]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get organization members
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of organization members
   */
  async getOrganizationMembers(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        uo.role,
        uo.created_at as joined_at,
        uo.is_active
      FROM users u
      INNER JOIN user_organizations uo ON u.id = uo.user_id
      WHERE uo.organization_id = ? AND uo.is_active = TRUE
      ORDER BY uo.created_at ASC
    `;

    return await this.executeQuery(query, [organizationId]);
  }

  /**
   * Validate that email is unique for organizations
   * @param {string} email - Email to check
   * @param {number} excludeId - Organization ID to exclude from check (for updates)
   * @throws {ConflictError} If email already exists
   */
  async validateUniqueEmail(email, excludeId = null) {
    if (!email) return;

    let query = 'SELECT id FROM organizations WHERE email = ?';
    const params = [email];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const results = await this.executeQuery(query, params);
    
    if (results.length > 0) {
      throw new ConflictError('Organization already exists with this email');
    }
  }

  /**
   * Search organizations by name or email
   * @param {string} searchQuery - Search query
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Array of matching organizations
   */
  async searchOrganizations(searchQuery, limit = 20) {
    if (!searchQuery) {
      throw new ValidationError('Search query is required');
    }

    const query = `
      SELECT id, name, email, city, state, country
      FROM organizations
      WHERE (name LIKE ? OR email LIKE ?)
      ORDER BY name ASC
      LIMIT ?
    `;

    const searchTerm = `%${searchQuery}%`;
    return await this.executeQuery(query, [searchTerm, searchTerm, limit]);
  }

  /**
   * Get organization settings/preferences
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Organization settings
   */
  async getOrganizationSettings(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    // This could be expanded to include settings from a separate table
    // For now, return basic organization data
    return await this.getOrganization(organizationId);
  }

  /**
   * Update organization settings
   * @param {number} organizationId - Organization ID
   * @param {Object} settings - Settings to update
   * @param {number} updatedBy - User ID who updated the settings
   * @returns {Promise<Object>} Updated organization
   */
  async updateOrganizationSettings(organizationId, settings, updatedBy) {
    // This method can be expanded when organization settings become more complex
    return await this.updateOrganization(organizationId, settings, updatedBy);
  }
}
