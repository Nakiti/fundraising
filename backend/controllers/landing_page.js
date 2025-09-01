import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js"
import { ValidationError } from "../utils/errors.js"
import { getPageService } from "../services/ServiceRegistry.js"
import { handlePageFileUpload, getImageFieldsForPageType } from "../utils/fileUploadHelper.js"

// Initialize service
const pageService = getPageService()

export const createLandingPage = asyncHandler(async (req, res) => {
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('landing'));
  
  // Validate required fields
  if (!req.body.organization_id) {
    throw new ValidationError('Organization ID is required');
  }
  if (!req.body.title) {
    throw new ValidationError('Title is required');
  }
  
  // Delegate to PageService
  const landingPage = await pageService.createLandingPage(req.body.organization_id, req.body, req.files);
  
  sendCreated(res, { pageId: landingPage.id }, 'Landing page created successfully');
})

export const updateLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Landing page ID is required');
  }
  
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('landing'));
  
  // Delegate to PageService
  const landingPage = await pageService.updateLandingPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: landingPage.id }, 'Landing page updated successfully');
})

export const getLandingPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }
  
  try {
    // Delegate to PageService
    const landingPage = await pageService.getLandingPage(organizationId);
    
    sendSuccess(res, landingPage, 'Landing page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Landing page not found');
    } else {
      throw error;
    }
  }
})