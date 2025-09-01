import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated
} from "../utils/response.js"
import { getOrganizationService } from "../services/ServiceRegistry.js"

// Initialize service
const organizationService = getOrganizationService()

export const register = asyncHandler(async (req, res) => {
  const organization = await organizationService.registerOrganization(req.body);
  sendCreated(res, { organizationId: organization.id }, 'Organization created successfully');
})

export const get = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organization = await organizationService.getOrganization(id);
  sendSuccess(res, organization, 'Organization retrieved successfully');
})

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { updated_by, ...updateData } = req.body;
  
  const organization = await organizationService.updateOrganization(id, updateData, updated_by);
  sendUpdated(res, organization, 'Organization updated successfully');
})

// Additional endpoints that can be added to routes as needed

export const getOrganizationsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const organizations = await organizationService.getOrganizationsByUser(userId);
  sendSuccess(res, organizations, 'User organizations retrieved successfully');
})

export const getOrganizationWithStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organization = await organizationService.getOrganizationWithStats(id);
  sendSuccess(res, organization, 'Organization with statistics retrieved successfully');
})

export const getOrganizationMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const members = await organizationService.getOrganizationMembers(id);
  sendSuccess(res, members, 'Organization members retrieved successfully');
})

export const searchOrganizations = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;
  const organizations = await organizationService.searchOrganizations(q, limit ? parseInt(limit) : undefined);
  sendSuccess(res, organizations, 'Organization search completed');
})



