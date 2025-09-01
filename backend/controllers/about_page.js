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

export const createAboutPage = asyncHandler(async (req, res) => {
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('about'));
  
  // Validate required fields
  if (!req.body.organization_id) {
    throw new ValidationError('Organization ID is required');
  }
  if (!req.body.title) {
    throw new ValidationError('Title is required');
  }
  
  // Delegate to PageService
  const aboutPage = await pageService.createAboutPage(req.body.organization_id, req.body, req.files);
  
  sendCreated(res, { pageId: aboutPage.id }, 'About page created successfully');
})

export const updateAboutPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('About page ID is required');
  }
  
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('about'));
  
  // Delegate to PageService
  const aboutPage = await pageService.updateAboutPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: aboutPage.id }, 'About page updated successfully');
})

export const getAboutPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }
  
  try {
    // Delegate to PageService
    const aboutPage = await pageService.getAboutPage(organizationId);
    
    sendSuccess(res, aboutPage, 'About page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'About page not found');
    } else {
      throw error;
    }
  }
})