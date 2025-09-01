import { asyncHandler } from "../middleware/errorHandler.js";
import {
  sendSuccess,
  sendUpdated,
  sendNotFound
} from "../utils/response.js";
import { ValidationError } from "../utils/errors.js";
import { getOrganizationStatusService } from "../services/ServiceRegistry.js";

// Initialize service
const organizationStatusService = getOrganizationStatusService();

/**
 * Check if all required components are active and update organization status
 * Required components: landing page, about page, header page, footer page, stripe config
 */
export const checkAndUpdateOrganizationStatus = asyncHandler(async (organizationId) => {
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  // Delegate to OrganizationStatusService
  return await organizationStatusService.checkAndUpdateOrganizationStatus(organizationId);
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

  // Delegate to OrganizationStatusService
  const result = await organizationStatusService.updateOrganizationStatus(organizationId, status);

  sendUpdated(res, { organizationId, status }, 'Organization status updated successfully');
});

/**
 * Get detailed organization status breakdown
 */
export const getOrganizationStatusBreakdown = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  try {
    // Delegate to OrganizationStatusService
    const breakdown = await organizationStatusService.getOrganizationStatusBreakdown(organizationId);

    sendSuccess(res, breakdown, 'Organization status breakdown retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else {
      throw error;
    }
  }
});

/**
 * Get organizations that need status updates (admin utility)
 */
export const getOrganizationsNeedingStatusUpdate = asyncHandler(async (req, res) => {
  // Delegate to OrganizationStatusService
  const organizations = await organizationStatusService.getOrganizationsNeedingStatusUpdate();

  sendSuccess(res, organizations, 'Organizations needing status update retrieved successfully');
});

/**
 * Batch update organization statuses (admin utility)
 */
export const batchUpdateOrganizationStatuses = asyncHandler(async (req, res) => {
  const { organizationIds } = req.body; // Optional array of specific IDs

  // Delegate to OrganizationStatusService
  const results = await organizationStatusService.batchUpdateOrganizationStatuses(organizationIds);

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  sendSuccess(res, {
    results,
    summary: {
      total: results.length,
      successful: successCount,
      failed: failureCount
    }
  }, `Batch update completed: ${successCount} successful, ${failureCount} failed`);
});

/**
 * Get organization status statistics (admin utility)
 */
export const getOrganizationStatusStats = asyncHandler(async (req, res) => {
  // Delegate to OrganizationStatusService
  const stats = await organizationStatusService.getOrganizationStatusStats();

  sendSuccess(res, stats, 'Organization status statistics retrieved successfully');
});

/**
 * Check if specific component is blocking organization activation
 */
export const checkComponentBlockingStatus = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { componentType } = req.query;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  if (!componentType) {
    throw new ValidationError('Component type is required');
  }

  try {
    // Delegate to OrganizationStatusService
    const blockingStatus = await organizationStatusService.isComponentBlockingActivation(
      organizationId, 
      componentType
    );

    sendSuccess(res, blockingStatus, 'Component blocking status retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else {
      throw error;
    }
  }
});