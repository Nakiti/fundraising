import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';

/**
 * Organization Status Service - Handles organization activation status management
 * Manages the business logic for determining when organizations should be active
 * based on required components (pages, payment configuration, etc.)
 */
export class OrganizationStatusService extends BaseService {
  constructor() {
    super('organizations');
  }

  /**
   * Required components for organization activation
   */
  static REQUIRED_COMPONENTS = {
    LANDING_PAGE: 'landing_page',
    ABOUT_PAGE: 'about_page', 
    HEADER_PAGE: 'header_page',
    FOOTER_PAGE: 'footer_page',
    STRIPE_CONFIG: 'stripe_config'
  };

  /**
   * Valid organization statuses
   */
  static VALID_STATUSES = ['active', 'inactive'];

  /**
   * Validate organization status data
   * @param {string} status - Status to validate
   */
  validateStatus(status) {
    if (!status || !OrganizationStatusService.VALID_STATUSES.includes(status)) {
      throw new ValidationError(`Status must be one of: ${OrganizationStatusService.VALID_STATUSES.join(', ')}`);
    }
  }

  /**
   * Get organization component status breakdown
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Component status breakdown
   */
  async getOrganizationComponentStatus(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const statusQuery = `
      SELECT 
        -- Organization details
        o.id as organization_id,
        o.name as organization_name,
        o.status as current_status,
        o.updated_at as last_updated,
        
        -- Landing page status
        CASE WHEN lp.active = 1 THEN 1 ELSE 0 END as landing_active,
        lp.id as landing_page_id,
        
        -- About page status  
        CASE WHEN ap.active = 1 THEN 1 ELSE 0 END as about_active,
        ap.id as about_page_id,
        
        -- Header page status
        CASE WHEN hp.active = 1 THEN 1 ELSE 0 END as header_active,
        hp.id as header_page_id,
        
        -- Footer page status
        CASE WHEN fp.active = 1 THEN 1 ELSE 0 END as footer_active,
        fp.id as footer_page_id,
        
        -- Stripe status (both charges enabled and details submitted required)
        CASE 
          WHEN o.stripe_charges_enabled = 1 AND o.stripe_details_submitted = 1 
          THEN 1 
          ELSE 0 
        END as stripe_active,
        o.stripe_account_id,
        o.stripe_charges_enabled,
        o.stripe_details_submitted
        
      FROM organizations o
      LEFT JOIN landing_pages lp ON o.id = lp.organization_id
      LEFT JOIN about_pages ap ON o.id = ap.organization_id  
      LEFT JOIN header_pages hp ON o.id = hp.organization_id
      LEFT JOIN footer_pages fp ON o.id = fp.organization_id
      WHERE o.id = ?
    `;

    const results = await this.executeQuery(statusQuery, [organizationId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return results[0];
  }

  /**
   * Determine if organization should be active based on component status
   * @param {Object} componentStatus - Component status object
   * @returns {boolean} True if organization should be active
   */
  shouldOrganizationBeActive(componentStatus) {
    return componentStatus.landing_active && 
           componentStatus.about_active && 
           componentStatus.header_active && 
           componentStatus.footer_active && 
           componentStatus.stripe_active;
  }

  /**
   * Update organization status in database
   * @param {number} organizationId - Organization ID
   * @param {string} newStatus - New status to set
   * @returns {Promise<Object>} Update result
   */
  async updateOrganizationStatusInDB(organizationId, newStatus) {
    this.validateStatus(newStatus);

    const updateQuery = `
      UPDATE organizations 
      SET status = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    const result = await this.executeQuery(updateQuery, [newStatus, organizationId]);
    
    if (result.affectedRows === 0) {
      throw new NotFoundError('Organization not found');
    }

    return {
      organizationId,
      newStatus,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  }

  /**
   * Check and update organization status based on component completion
   * This is the main business logic function used throughout the system
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Status check and update result
   */
  async checkAndUpdateOrganizationStatus(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    // Get current component status
    const componentStatus = await this.getOrganizationComponentStatus(organizationId);
    
    // Determine if organization should be active
    const shouldBeActive = this.shouldOrganizationBeActive(componentStatus);
    const newStatus = shouldBeActive ? 'active' : 'inactive';
    
    // Check if status needs to change
    const statusChanged = componentStatus.current_status !== newStatus;
    
    if (statusChanged) {
      // Update status in database
      await this.updateOrganizationStatusInDB(organizationId, newStatus);
      
      console.log(`Organization ${componentStatus.organization_name} status updated from '${componentStatus.current_status}' to '${newStatus}'`);
    }

    return {
      organizationId,
      organizationName: componentStatus.organization_name,
      previousStatus: componentStatus.current_status,
      newStatus: newStatus,
      statusChanged: statusChanged,
      shouldBeActive: shouldBeActive,
      requiredComponents: {
        [OrganizationStatusService.REQUIRED_COMPONENTS.LANDING_PAGE]: !!componentStatus.landing_active,
        [OrganizationStatusService.REQUIRED_COMPONENTS.ABOUT_PAGE]: !!componentStatus.about_active,
        [OrganizationStatusService.REQUIRED_COMPONENTS.HEADER_PAGE]: !!componentStatus.header_active,
        [OrganizationStatusService.REQUIRED_COMPONENTS.FOOTER_PAGE]: !!componentStatus.footer_active,
        [OrganizationStatusService.REQUIRED_COMPONENTS.STRIPE_CONFIG]: !!componentStatus.stripe_active
      }
    };
  }

  /**
   * Manually update organization status (admin function)
   * @param {number} organizationId - Organization ID
   * @param {string} status - New status to set
   * @returns {Promise<Object>} Update result
   */
  async updateOrganizationStatus(organizationId, status) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    this.validateStatus(status);

    // Check if organization exists first
    const exists = await this.findById(organizationId);
    if (!exists) {
      throw new NotFoundError('Organization not found');
    }

    // Update status
    const result = await this.updateOrganizationStatusInDB(organizationId, status);
    
    return {
      organizationId,
      status,
      message: 'Organization status updated successfully',
      ...result
    };
  }

  /**
   * Get detailed organization status breakdown
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Detailed status breakdown
   */
  async getOrganizationStatusBreakdown(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const statusQuery = `
      SELECT 
        o.name as organization_name,
        o.status as current_status,
        o.updated_at as last_updated,
        
        -- Landing page details
        CASE WHEN lp.active = 1 THEN 'active' ELSE 'inactive' END as landing_page_status,
        lp.id as landing_page_id,
        lp.title as landing_page_title,
        
        -- About page details
        CASE WHEN ap.active = 1 THEN 'active' ELSE 'inactive' END as about_page_status,
        ap.id as about_page_id,
        ap.title as about_page_title,
        
        -- Header page details
        CASE WHEN hp.active = 1 THEN 'active' ELSE 'inactive' END as header_page_status,
        hp.id as header_page_id,
        
        -- Footer page details
        CASE WHEN fp.active = 1 THEN 'active' ELSE 'inactive' END as footer_page_status,
        fp.id as footer_page_id,
        
        -- Stripe details
        o.stripe_account_id,
        o.stripe_charges_enabled,
        o.stripe_details_submitted,
        CASE 
          WHEN o.stripe_charges_enabled = 1 AND o.stripe_details_submitted = 1 
          THEN 'active' 
          ELSE 'inactive' 
        END as stripe_status
        
      FROM organizations o
      LEFT JOIN landing_pages lp ON o.id = lp.organization_id
      LEFT JOIN about_pages ap ON o.id = ap.organization_id  
      LEFT JOIN header_pages hp ON o.id = hp.organization_id
      LEFT JOIN footer_pages fp ON o.id = fp.organization_id
      WHERE o.id = ?
    `;

    const results = await this.executeQuery(statusQuery, [organizationId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    const breakdown = results[0];
    
    // Calculate overall eligibility
    const allComponentsActive = breakdown.landing_page_status === 'active' &&
                              breakdown.about_page_status === 'active' &&
                              breakdown.header_page_status === 'active' &&
                              breakdown.footer_page_status === 'active' &&
                              breakdown.stripe_status === 'active';

    return {
      organizationId: parseInt(organizationId),
      organizationName: breakdown.organization_name,
      currentStatus: breakdown.current_status,
      lastUpdated: breakdown.last_updated,
      shouldBeActive: allComponentsActive,
      statusMatch: breakdown.current_status === (allComponentsActive ? 'active' : 'inactive'),
      components: {
        [OrganizationStatusService.REQUIRED_COMPONENTS.LANDING_PAGE]: {
          status: breakdown.landing_page_status,
          id: breakdown.landing_page_id,
          title: breakdown.landing_page_title,
          exists: !!breakdown.landing_page_id,
          active: breakdown.landing_page_status === 'active'
        },
        [OrganizationStatusService.REQUIRED_COMPONENTS.ABOUT_PAGE]: {
          status: breakdown.about_page_status,
          id: breakdown.about_page_id,
          title: breakdown.about_page_title,
          exists: !!breakdown.about_page_id,
          active: breakdown.about_page_status === 'active'
        },
        [OrganizationStatusService.REQUIRED_COMPONENTS.HEADER_PAGE]: {
          status: breakdown.header_page_status,
          id: breakdown.header_page_id,
          exists: !!breakdown.header_page_id,
          active: breakdown.header_page_status === 'active'
        },
        [OrganizationStatusService.REQUIRED_COMPONENTS.FOOTER_PAGE]: {
          status: breakdown.footer_page_status,
          id: breakdown.footer_page_id,
          exists: !!breakdown.footer_page_id,
          active: breakdown.footer_page_status === 'active'
        },
        [OrganizationStatusService.REQUIRED_COMPONENTS.STRIPE_CONFIG]: {
          status: breakdown.stripe_status,
          account_id: breakdown.stripe_account_id,
          charges_enabled: !!breakdown.stripe_charges_enabled,
          details_submitted: !!breakdown.stripe_details_submitted,
          exists: !!breakdown.stripe_account_id,
          active: breakdown.stripe_status === 'active'
        }
      }
    };
  }

  /**
   * Get organizations that need status updates
   * Useful for batch processing or monitoring
   * @returns {Promise<Array>} Organizations with status mismatches
   */
  async getOrganizationsNeedingStatusUpdate() {
    const query = `
      SELECT 
        o.id,
        o.name,
        o.status as current_status,
        
        -- Calculate what status should be
        CASE 
          WHEN lp.active = 1 AND ap.active = 1 AND hp.active = 1 AND fp.active = 1 
               AND o.stripe_charges_enabled = 1 AND o.stripe_details_submitted = 1
          THEN 'active' 
          ELSE 'inactive' 
        END as should_be_status
        
      FROM organizations o
      LEFT JOIN landing_pages lp ON o.id = lp.organization_id
      LEFT JOIN about_pages ap ON o.id = ap.organization_id  
      LEFT JOIN header_pages hp ON o.id = hp.organization_id
      LEFT JOIN footer_pages fp ON o.id = fp.organization_id
      
      HAVING current_status != should_be_status
      ORDER BY o.name
    `;

    const results = await this.executeQuery(query, []);
    return results || [];
  }

  /**
   * Batch update organization statuses
   * Updates multiple organizations to their correct status
   * @param {Array<number>} organizationIds - Array of organization IDs (optional)
   * @returns {Promise<Array>} Array of update results
   */
  async batchUpdateOrganizationStatuses(organizationIds = null) {
    let organizationsToUpdate;
    
    if (organizationIds && Array.isArray(organizationIds)) {
      // Update specific organizations
      organizationsToUpdate = [];
      for (const id of organizationIds) {
        try {
          const breakdown = await this.getOrganizationComponentStatus(id);
          const shouldBeActive = this.shouldOrganizationBeActive(breakdown);
          const shouldBeStatus = shouldBeActive ? 'active' : 'inactive';
          
          if (breakdown.current_status !== shouldBeStatus) {
            organizationsToUpdate.push({
              id: breakdown.organization_id,
              name: breakdown.organization_name,
              current_status: breakdown.current_status,
              should_be_status: shouldBeStatus
            });
          }
        } catch (error) {
          console.warn(`Skipping organization ${id}: ${error.message}`);
        }
      }
    } else {
      // Get all organizations that need updates
      organizationsToUpdate = await this.getOrganizationsNeedingStatusUpdate();
    }

    const updateResults = [];
    
    for (const org of organizationsToUpdate) {
      try {
        const result = await this.checkAndUpdateOrganizationStatus(org.id);
        updateResults.push({
          success: true,
          organizationId: org.id,
          organizationName: org.name,
          ...result
        });
      } catch (error) {
        updateResults.push({
          success: false,
          organizationId: org.id,
          organizationName: org.name,
          error: error.message
        });
      }
    }

    return updateResults;
  }

  /**
   * Get organization status summary statistics
   * @returns {Promise<Object>} Status statistics
   */
  async getOrganizationStatusStats() {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_organizations,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_organizations,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_organizations,
        
        -- Calculate organizations that should be active
        COUNT(CASE 
          WHEN lp.active = 1 AND ap.active = 1 AND hp.active = 1 AND fp.active = 1 
               AND stripe_charges_enabled = 1 AND stripe_details_submitted = 1
          THEN 1 
        END) as should_be_active,
        
        -- Calculate status mismatches
        COUNT(CASE 
          WHEN status != CASE 
            WHEN lp.active = 1 AND ap.active = 1 AND hp.active = 1 AND fp.active = 1 
                 AND stripe_charges_enabled = 1 AND stripe_details_submitted = 1
            THEN 'active' 
            ELSE 'inactive' 
          END
          THEN 1 
        END) as status_mismatches
        
      FROM organizations o
      LEFT JOIN landing_pages lp ON o.id = lp.organization_id
      LEFT JOIN about_pages ap ON o.id = ap.organization_id  
      LEFT JOIN header_pages hp ON o.id = hp.organization_id
      LEFT JOIN footer_pages fp ON o.id = fp.organization_id
    `;

    const results = await this.executeQuery(statsQuery, []);
    const stats = results[0] || {};

    return {
      total_organizations: stats.total_organizations || 0,
      active_organizations: stats.active_organizations || 0,
      inactive_organizations: stats.inactive_organizations || 0,
      should_be_active: stats.should_be_active || 0,
      status_mismatches: stats.status_mismatches || 0,
      accuracy_percentage: stats.total_organizations > 0 
        ? ((stats.total_organizations - stats.status_mismatches) / stats.total_organizations * 100).toFixed(2)
        : 100
    };
  }

  /**
   * Check if specific component is blocking organization activation
   * @param {number} organizationId - Organization ID
   * @param {string} componentType - Component type to check
   * @returns {Promise<Object>} Component blocking status
   */
  async isComponentBlockingActivation(organizationId, componentType) {
    if (!Object.values(OrganizationStatusService.REQUIRED_COMPONENTS).includes(componentType)) {
      throw new ValidationError(`Invalid component type: ${componentType}`);
    }

    const breakdown = await this.getOrganizationStatusBreakdown(organizationId);
    const component = breakdown.components[componentType];
    
    return {
      organizationId,
      componentType,
      isBlocking: !component.active,
      componentStatus: component,
      organizationCurrentlyActive: breakdown.currentStatus === 'active',
      wouldActivateOrganization: component.active && breakdown.shouldBeActive
    };
  }
}
