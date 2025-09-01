import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';

/**
 * User Organization Service - Handles user-organization relationship management
 * Manages user memberships, invitations, and role assignments
 */
export class UserOrganizationService extends BaseService {
  constructor() {
    super('user_organizations');
  }

  /**
   * Valid relationship statuses
   */
  static VALID_STATUSES = ['pending', 'active', 'inactive', 'declined', 'removed'];

  /**
   * Valid user roles
   */
  static VALID_ROLES = ['owner', 'admin', 'member', 'viewer', 'moderator'];

  /**
   * Validate user organization relationship data
   * @param {Object} relationData - Relationship data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateRelationData(relationData, isUpdate = false) {
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(relationData, [
        'user_id', 
        'organization_id', 
        'status', 
        'role'
      ]);
    }

    // Validate status
    if (relationData.status && !UserOrganizationService.VALID_STATUSES.includes(relationData.status)) {
      throw new ValidationError(`Status must be one of: ${UserOrganizationService.VALID_STATUSES.join(', ')}`);
    }

    // Validate role
    if (relationData.role && !UserOrganizationService.VALID_ROLES.includes(relationData.role)) {
      throw new ValidationError(`Role must be one of: ${UserOrganizationService.VALID_ROLES.join(', ')}`);
    }

    // Validate IDs are positive integers
    if (relationData.user_id !== undefined) {
      const userId = parseInt(relationData.user_id);
      if (isNaN(userId) || userId <= 0) {
        throw new ValidationError('User ID must be a positive integer');
      }
    }

    if (relationData.organization_id !== undefined) {
      const orgId = parseInt(relationData.organization_id);
      if (isNaN(orgId) || orgId <= 0) {
        throw new ValidationError('Organization ID must be a positive integer');
      }
    }
  }

  /**
   * Check if user already has a relationship with organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object|null>} Existing relationship or null
   */
  async checkExistingRelation(userId, organizationId) {
    const query = `
      SELECT * FROM user_organizations 
      WHERE user_id = ? AND organization_id = ?
    `;

    const results = await this.executeQuery(query, [userId, organizationId]);
    return results && results.length > 0 ? results[0] : null;
  }

  /**
   * Create a new user-organization relationship
   * @param {Object} relationData - Relationship data
   * @returns {Promise<Object>} Created relationship data
   */
  async createUserOrganizationRelation(relationData) {
    // Validate input data
    this.validateRelationData(relationData, false);

    // Check for existing relationship
    const existingRelation = await this.checkExistingRelation(
      relationData.user_id, 
      relationData.organization_id
    );

    if (existingRelation) {
      throw new ValidationError('User already has a relationship with this organization');
    }

    // Prepare relationship data
    const relationToCreate = {
      user_id: relationData.user_id,
      organization_id: relationData.organization_id,
      status: relationData.status,
      role: relationData.role,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create relationship
    const result = await this.create(relationToCreate);
    
    return {
      id: result.insertId,
      ...relationToCreate
    };
  }

  /**
   * Get all organizations for a user
   * @param {number} userId - User ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Array of user organizations
   */
  async getUserOrganizations(userId, status = null) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    let query = `
      SELECT 
        organizations.name, 
        organizations.id AS organization_id, 
        user_organizations.role, 
        user_organizations.id,
        user_organizations.status,
        user_organizations.created_at,
        user_organizations.updated_at
      FROM user_organizations
      JOIN organizations ON user_organizations.organization_id = organizations.id
      WHERE user_organizations.user_id = ?
    `;

    const params = [userId];

    if (status) {
      if (!UserOrganizationService.VALID_STATUSES.includes(status)) {
        throw new ValidationError(`Status must be one of: ${UserOrganizationService.VALID_STATUSES.join(', ')}`);
      }
      query += ' AND user_organizations.status = ?';
      params.push(status);
    }

    query += ' ORDER BY user_organizations.created_at DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get pending organization invitations for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of pending invitations
   */
  async getPendingUserOrganizations(userId) {
    return await this.getUserOrganizations(userId, 'pending');
  }

  /**
   * Get active organization memberships for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of active memberships
   */
  async getActiveUserOrganizations(userId) {
    return await this.getUserOrganizations(userId, 'active');
  }

  /**
   * Update user-organization relationship
   * @param {number} relationId - Relationship ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated relationship data
   */
  async updateUserOrganizationRelation(relationId, updateData) {
    if (!relationId) {
      throw new ValidationError('Relationship ID is required');
    }

    // Validate input data
    this.validateRelationData(updateData, true);

    // Check if relationship exists
    const existingRelation = await this.findById(relationId);
    if (!existingRelation) {
      throw new NotFoundError('User organization relationship not found');
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date()
    };

    // Update relationship
    await this.update(relationId, dataToUpdate);

    // Return updated relationship
    return await this.findById(relationId);
  }

  /**
   * Activate a pending user-organization relationship
   * @param {number} relationId - Relationship ID
   * @returns {Promise<Object>} Updated relationship data
   */
  async activateUserOrganizationRelation(relationId) {
    return await this.updateUserOrganizationRelation(relationId, { status: 'active' });
  }

  /**
   * Decline a pending user-organization relationship
   * @param {number} relationId - Relationship ID
   * @returns {Promise<Object>} Updated relationship data
   */
  async declineUserOrganizationRelation(relationId) {
    return await this.updateUserOrganizationRelation(relationId, { status: 'declined' });
  }

  /**
   * Remove a user from an organization
   * @param {number} relationId - Relationship ID
   * @returns {Promise<Object>} Updated relationship data
   */
  async removeUserFromOrganization(relationId) {
    return await this.updateUserOrganizationRelation(relationId, { status: 'removed' });
  }

  /**
   * Update user role in organization
   * @param {number} relationId - Relationship ID
   * @param {string} newRole - New role
   * @returns {Promise<Object>} Updated relationship data
   */
  async updateUserRole(relationId, newRole) {
    if (!newRole || !UserOrganizationService.VALID_ROLES.includes(newRole)) {
      throw new ValidationError(`Role must be one of: ${UserOrganizationService.VALID_ROLES.join(', ')}`);
    }

    return await this.updateUserOrganizationRelation(relationId, { role: newRole });
  }

  /**
   * Get all users for an organization
   * @param {number} organizationId - Organization ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Array of organization users
   */
  async getOrganizationUsers(organizationId, status = null) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    let query = `
      SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        user_organizations.role,
        user_organizations.status,
        user_organizations.id AS relation_id,
        user_organizations.created_at,
        user_organizations.updated_at
      FROM user_organizations
      JOIN users ON user_organizations.user_id = users.id
      WHERE user_organizations.organization_id = ?
    `;

    const params = [organizationId];

    if (status) {
      if (!UserOrganizationService.VALID_STATUSES.includes(status)) {
        throw new ValidationError(`Status must be one of: ${UserOrganizationService.VALID_STATUSES.join(', ')}`);
      }
      query += ' AND user_organizations.status = ?';
      params.push(status);
    }

    query += ' ORDER BY user_organizations.created_at DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get active users for an organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of active organization users
   */
  async getActiveOrganizationUsers(organizationId) {
    return await this.getOrganizationUsers(organizationId, 'active');
  }

  /**
   * Get pending users for an organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Array>} Array of pending organization users
   */
  async getPendingOrganizationUsers(organizationId) {
    return await this.getOrganizationUsers(organizationId, 'pending');
  }

  /**
   * Check if user has specific role in organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} Whether user has the role
   */
  async userHasRole(userId, organizationId, role) {
    if (!userId || !organizationId || !role) {
      return false;
    }

    const query = `
      SELECT COUNT(*) as count
      FROM user_organizations
      WHERE user_id = ? 
      AND organization_id = ? 
      AND role = ? 
      AND status = 'active'
    `;

    const results = await this.executeQuery(query, [userId, organizationId, role]);
    return results && results[0] && results[0].count > 0;
  }

  /**
   * Check if user is admin or owner in organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<boolean>} Whether user is admin/owner
   */
  async userIsAdminOrOwner(userId, organizationId) {
    return await this.userHasRole(userId, organizationId, 'admin') || 
           await this.userHasRole(userId, organizationId, 'owner');
  }

  /**
   * Check if user is owner in organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<boolean>} Whether user is owner
   */
  async userIsOwner(userId, organizationId) {
    return await this.userHasRole(userId, organizationId, 'owner');
  }

  /**
   * Get user's highest role in organization
   * @param {number} userId - User ID
   * @param {number} organizationId - Organization ID
   * @returns {Promise<string|null>} User's highest role or null
   */
  async getUserHighestRole(userId, organizationId) {
    if (!userId || !organizationId) {
      return null;
    }

    const query = `
      SELECT role
      FROM user_organizations
      WHERE user_id = ? 
      AND organization_id = ? 
      AND status = 'active'
      ORDER BY 
        CASE role
          WHEN 'owner' THEN 1
          WHEN 'admin' THEN 2
          WHEN 'moderator' THEN 3
          WHEN 'member' THEN 4
          WHEN 'viewer' THEN 5
          ELSE 6
        END
      LIMIT 1
    `;

    const results = await this.executeQuery(query, [userId, organizationId]);
    return results && results[0] ? results[0].role : null;
  }

  /**
   * Bulk invite users to organization
   * @param {number} organizationId - Organization ID
   * @param {Array<Object>} invitations - Array of invitation data
   * @returns {Promise<Array>} Array of invitation results
   */
  async bulkInviteUsers(organizationId, invitations) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!Array.isArray(invitations) || invitations.length === 0) {
      throw new ValidationError('Invitations array is required and cannot be empty');
    }

    const results = [];

    for (const invitation of invitations) {
      try {
        const relationData = {
          user_id: invitation.user_id,
          organization_id: organizationId,
          status: 'pending',
          role: invitation.role || 'member'
        };

        const createdRelation = await this.createUserOrganizationRelation(relationData);
        results.push({
          success: true,
          user_id: invitation.user_id,
          relation_id: createdRelation.id
        });
      } catch (error) {
        results.push({
          success: false,
          user_id: invitation.user_id,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get organization membership statistics
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Membership statistics
   */
  async getOrganizationMembershipStats(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        COUNT(*) as total_members,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_members,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invitations,
        COUNT(CASE WHEN status = 'declined' THEN 1 END) as declined_invitations,
        COUNT(CASE WHEN status = 'removed' THEN 1 END) as removed_members,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderators,
        COUNT(CASE WHEN role = 'member' THEN 1 END) as members,
        COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers
      FROM user_organizations
      WHERE organization_id = ?
    `;

    const results = await this.executeQuery(query, [organizationId]);
    const stats = results[0] || {};

    return {
      total_members: parseInt(stats.total_members) || 0,
      active_members: parseInt(stats.active_members) || 0,
      pending_invitations: parseInt(stats.pending_invitations) || 0,
      declined_invitations: parseInt(stats.declined_invitations) || 0,
      removed_members: parseInt(stats.removed_members) || 0,
      owners: parseInt(stats.owners) || 0,
      admins: parseInt(stats.admins) || 0,
      moderators: parseInt(stats.moderators) || 0,
      members: parseInt(stats.members) || 0,
      viewers: parseInt(stats.viewers) || 0,
      acceptance_rate: stats.total_members > 0 
        ? ((stats.active_members / stats.total_members) * 100).toFixed(2)
        : 0
    };
  }

  /**
   * Delete user-organization relationship
   * @param {number} relationId - Relationship ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUserOrganizationRelation(relationId) {
    if (!relationId) {
      throw new ValidationError('Relationship ID is required');
    }

    // Check if relationship exists
    const existingRelation = await this.findById(relationId);
    if (!existingRelation) {
      throw new NotFoundError('User organization relationship not found');
    }

    // Delete relationship
    await this.delete(relationId);
    return true;
  }
}
