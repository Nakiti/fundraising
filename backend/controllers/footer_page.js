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

export const createFooterPage = asyncHandler(async (req, res) => {
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('footer'));
  
  // Validate required fields
  if (!req.body.organization_id) {
    throw new ValidationError('Organization ID is required');
  }
  if (!req.body.user_id) {
    throw new ValidationError('User ID is required');
  }
  
  // Delegate to PageService
  const footerPage = await pageService.createFooterPage(req.body.organization_id, req.body, req.files);
  
  sendCreated(res, { pageId: footerPage.id }, 'Footer page created successfully');
})

export const updateFooterPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Footer page ID is required');
  }
  
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('footer'));
  
  // Delegate to PageService
  const footerPage = await pageService.updateFooterPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: footerPage.id }, 'Footer page updated successfully');
})

export const getFooterPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }
  
  try {
    // Delegate to PageService
    const footerPage = await pageService.getFooterPage(organizationId);
    
    sendSuccess(res, footerPage, 'Footer page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Header page not found');
    } else {
      throw error;
    }
  }
})