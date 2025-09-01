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

export const createHeaderPage = asyncHandler(async (req, res) => {
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('header'));
  
  // Validate required fields
  if (!req.body.organization_id) {
    throw new ValidationError('Organization ID is required');
  }
  if (!req.body.user_id) {
    throw new ValidationError('User ID is required');
  }
  
  // Delegate to PageService
  const headerPage = await pageService.createHeaderPage(req.body.organization_id, req.body, req.files);
  
  sendCreated(res, { pageId: headerPage.id }, 'Header page created successfully');
})

export const updateHeaderPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Header page ID is required');
  }
  
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('header'));
  
  // Delegate to PageService
  const headerPage = await pageService.updateHeaderPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: headerPage.id }, 'Header page updated successfully');
})

export const getHeaderPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }
  
  try {
    // Delegate to PageService
    const headerPage = await pageService.getHeaderPage(organizationId);
    
    sendSuccess(res, headerPage, 'Header page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Header page not found');
    } else {
      throw error;
    }
  }
})