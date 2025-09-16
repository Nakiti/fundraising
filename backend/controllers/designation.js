import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js"
import { ValidationError } from "../utils/errors.js"
import { getDesignationService } from "../services/ServiceRegistry.js"

// Initialize service
const designationService = getDesignationService()

export const createDesignation = asyncHandler(async (req, res) => {
  // Delegate to DesignationService
  const designation = await designationService.createDesignation(req.body);
  
  sendCreated(res, { designationId: designation.id }, 'Designation created successfully');
})

export const updateDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }
  
  // Delegate to DesignationService
  const designation = await designationService.updateDesignation(id, req.body);
  
  sendUpdated(res, designation, 'Designation updated successfully');
})

export const getDesignations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to DesignationService
  const designations = await designationService.getDesignationsByOrganization(id);
  
  sendSuccess(res, designations, 'Designations retrieved successfully');
})

export const getDesignationsByCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  // console.log("id", id)
  
  // Delegate to DesignationService
  const designations = await designationService.getDesignationsByCampaign(id);
  // console.log("designations", designations)
  
  sendSuccess(res, designations, 'Campaign designations retrieved successfully');
})

export const getActiveDesignations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to DesignationService
  const designations = await designationService.getActiveDesignations(id);
  
  sendSuccess(res, designations, 'Active designations retrieved successfully');
})

export const getDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }
  
  try {
    // Delegate to DesignationService
    const designation = await designationService.getDesignation(id);
    
    sendSuccess(res, designation, 'Designation retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Designation not found');
    } else {
      throw error;
    }
  }
})

export const deleteDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }
  
  // Delegate to DesignationService
  await designationService.deleteDesignation(id);
  
  sendSuccess(res, null, 'Designation deleted successfully');
})

export const getDefaultDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  try {
    // Delegate to DesignationService
    const designation = await designationService.getDefaultDesignation(id);
    
    sendSuccess(res, designation, 'Default designation retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Default designation not found for this campaign');
    } else {
      throw error;
    }
  }
})