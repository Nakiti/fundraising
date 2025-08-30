import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  sendSuccess,
  sendUpdated,
  sendNotFound
} from "../utils/response.js";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  logSQLError
} from "../utils/errors.js";

/**
 * Check if all required components are active and update organization status
 * Required components: landing page, about page, header page, footer page, stripe config
 */
export const checkAndUpdateOrganizationStatus = asyncHandler(async (organizationId) => {
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  return new Promise((resolve, reject) => {
    // Query to check all required components
    const statusQuery = `
      SELECT 
        -- Landing page status
        CASE WHEN lp.active = 1 THEN 1 ELSE 0 END as landing_active,
        
        -- About page status  
        CASE WHEN ap.active = 1 THEN 1 ELSE 0 END as about_active,
        
        -- Header page status
        CASE WHEN hp.active = 1 THEN 1 ELSE 0 END as header_active,
        
        -- Footer page status
        CASE WHEN fp.active = 1 THEN 1 ELSE 0 END as footer_active,
        
        -- Stripe status (both charges enabled and details submitted required)
        CASE 
          WHEN o.stripe_charges_enabled = 1 AND o.stripe_details_submitted = 1 
          THEN 1 
          ELSE 0 
        END as stripe_active,
        
        -- Current organization status
        o.status as current_status,
        o.name as organization_name
        
      FROM organizations o
      LEFT JOIN landing_pages lp ON o.id = lp.organization_id
      LEFT JOIN about_pages ap ON o.id = ap.organization_id  
      LEFT JOIN header_pages hp ON o.id = hp.organization_id
      LEFT JOIN footer_pages fp ON o.id = fp.organization_id
      WHERE o.id = ?
    `;

    db.query(statusQuery, [organizationId], (err, data) => {
      if (err) {
        logSQLError(err, 'Organization status check query');
        reject(new DatabaseError('Failed to check organization status', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const status = data[0];
      
      // Determine if organization should be active
      // All components must be active
      const shouldBeActive = status.landing_active && 
                           status.about_active && 
                           status.header_active && 
                           status.footer_active && 
                           status.stripe_active;

      const newStatus = shouldBeActive ? 'active' : 'inactive';
      
      // Only update if status has changed
      if (status.current_status !== newStatus) {
        const updateQuery = `
          UPDATE organizations 
          SET status = ?, updated_at = NOW() 
          WHERE id = ?
        `;

        db.query(updateQuery, [newStatus, organizationId], (updateErr, updateData) => {
          if (updateErr) {
            logSQLError(updateErr, 'Organization status update query');
            reject(new DatabaseError('Failed to update organization status', updateErr));
            return;
          }

          console.log(`Organization ${status.organization_name} status updated from '${status.current_status}' to '${newStatus}'`);
          
          resolve({
            organizationId,
            organizationName: status.organization_name,
            previousStatus: status.current_status,
            newStatus: newStatus,
            statusChanged: true,
            requiredComponents: {
              landing_page: !!status.landing_active,
              about_page: !!status.about_active,
              header_page: !!status.header_active,
              footer_page: !!status.footer_active,
              stripe_config: !!status.stripe_active
            }
          });
        });
      } else {
        // Status hasn't changed
        resolve({
          organizationId,
          organizationName: status.organization_name,
          previousStatus: status.current_status,
          newStatus: newStatus,
          statusChanged: false,
          requiredComponents: {
            landing_page: !!status.landing_active,
            about_page: !!status.about_active,
            header_page: !!status.header_active,
            footer_page: !!status.footer_active,
            stripe_config: !!status.stripe_active
          }
        });
      }
    });
  });
});

/**
 * Manual endpoint to update organization status (for admin use)
 */
export const updateOrganizationStatus = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { status } = req.body;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  if (!status || !['active', 'inactive'].includes(status)) {
    throw new ValidationError('Status must be either "active" or "inactive"');
  }

  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE organizations 
      SET status = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    db.query(updateQuery, [status, organizationId], (err, data) => {
      if (err) {
        logSQLError(err, 'Manual organization status update query');
        reject(new DatabaseError('Failed to update organization status', err));
        return;
      }

      if (data.affectedRows === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      sendUpdated(res, { organizationId, status }, 'Organization status updated successfully');
      resolve();
    });
  });
});

/**
 * Get detailed organization status breakdown
 */
export const getOrganizationStatusBreakdown = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  return new Promise((resolve, reject) => {
    const statusQuery = `
      SELECT 
        o.name as organization_name,
        o.status as current_status,
        
        -- Landing page details
        CASE WHEN lp.active = 1 THEN 'active' ELSE 'inactive' END as landing_page_status,
        lp.id as landing_page_id,
        
        -- About page details
        CASE WHEN ap.active = 1 THEN 'active' ELSE 'inactive' END as about_page_status,
        ap.id as about_page_id,
        
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

    db.query(statusQuery, [organizationId], (err, data) => {
      if (err) {
        logSQLError(err, 'Organization status breakdown query');
        reject(new DatabaseError('Failed to get organization status breakdown', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const breakdown = data[0];
      
      // Calculate overall eligibility
      const allComponentsActive = breakdown.landing_page_status === 'active' &&
                                breakdown.about_page_status === 'active' &&
                                breakdown.header_page_status === 'active' &&
                                breakdown.footer_page_status === 'active' &&
                                breakdown.stripe_status === 'active';

      const response = {
        organizationName: breakdown.organization_name,
        currentStatus: breakdown.current_status,
        shouldBeActive: allComponentsActive,
        statusMatch: breakdown.current_status === (allComponentsActive ? 'active' : 'inactive'),
        components: {
          landing_page: {
            status: breakdown.landing_page_status,
            id: breakdown.landing_page_id,
            exists: !!breakdown.landing_page_id
          },
          about_page: {
            status: breakdown.about_page_status,
            id: breakdown.about_page_id,
            exists: !!breakdown.about_page_id
          },
          header_page: {
            status: breakdown.header_page_status,
            id: breakdown.header_page_id,
            exists: !!breakdown.header_page_id
          },
          footer_page: {
            status: breakdown.footer_page_status,
            id: breakdown.footer_page_id,
            exists: !!breakdown.footer_page_id
          },
          stripe_config: {
            status: breakdown.stripe_status,
            account_id: breakdown.stripe_account_id,
            charges_enabled: !!breakdown.stripe_charges_enabled,
            details_submitted: !!breakdown.stripe_details_submitted,
            exists: !!breakdown.stripe_account_id
          }
        }
      };

      sendSuccess(res, response, 'Organization status breakdown retrieved successfully');
      resolve();
    });
  });
});

