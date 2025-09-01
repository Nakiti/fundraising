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

export const createThankYouPage = asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.campaign_id) {
    throw new ValidationError('Campaign ID is required');
  }
  if (!req.body.user_id) {
    throw new ValidationError('User ID is required');
  }
  
  // Add updated_at and updated_by fields
  const pageData = {
    ...req.body,
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_by: req.body.user_id
  };
  
  // Delegate to PageService
  const thankYouPage = await pageService.createThankYouPage(req.body.campaign_id, pageData, {});
  
  sendCreated(res, { pageId: thankYouPage.id }, 'Thank you page created successfully');
})

export const updateThankYouPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  // Handle file upload (single file for bg_image)
  await handlePageFileUpload(req, res, getImageFieldsForPageType('thankyou-page'));
  
  // Delegate to PageService
  const thankYouPage = await pageService.updateThankYouPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: thankYouPage.id }, 'Thank you page updated successfully');
})

export const getThankYouPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  try {
    // Delegate to PageService
    const thankYouPage = await pageService.getThankYouPage(id);
    
    sendSuccess(res, thankYouPage, 'Thank you page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Thank you page not found');
    } else {
      throw error;
    }
  }
})