import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js"
import { ValidationError } from "../utils/errors.js"
import { getSectionService } from "../services/ServiceRegistry.js"

// Initialize service
const sectionService = getSectionService()

export const createSection = asyncHandler(async (req, res) => {
  // Delegate to SectionService
  const section = await sectionService.createSection(req.body);
  
  sendCreated(res, { sectionId: section.id }, 'Section created successfully');
})

export const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }
  
  // Delegate to SectionService
  const section = await sectionService.updateSection(id, req.body);
  
  sendUpdated(res, { success: true }, 'Section updated successfully');
})

export const getSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }
  
  try {
    // Delegate to SectionService
    const section = await sectionService.getSection(id);
    
    sendSuccess(res, section, 'Section retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Section not found');
    } else {
      throw error;
    }
  }
})

export const getSectionsByPage = asyncHandler(async (req, res) => {
  const { organization_id, page_type, page_reference_id } = req.query;
  
  if (!organization_id || !page_type || !page_reference_id) {
    throw new ValidationError('Missing required parameters: organization_id, page_type, page_reference_id');
  }
  
  // Delegate to SectionService
  const sections = await sectionService.getSectionsByPage(
    organization_id, 
    page_type, 
    page_reference_id
  );
  
  sendSuccess(res, sections, 'Sections retrieved successfully');
})

// Legacy endpoint for backward compatibility
export const getSectionByPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Page ID is required');
  }
  
  // Delegate to SectionService (legacy support)
  const sections = await sectionService.getSectionsByPageReference(id);
  
  sendSuccess(res, sections, 'Sections retrieved successfully');
})

export const updateSectionOrder = asyncHandler(async (req, res) => {
  const { organization_id, page_type, page_reference_id, sections } = req.body;
  
  if (!organization_id || !page_type || !page_reference_id || !sections) {
    throw new ValidationError('Missing required fields: organization_id, page_type, page_reference_id, sections');
  }
  
  // Delegate to SectionService
  await sectionService.updateSectionOrder(
    organization_id, 
    page_type, 
    page_reference_id, 
    sections
  );
  
  sendUpdated(res, {}, 'Section order updated successfully');
})