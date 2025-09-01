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

export const createDonationPage = asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.campaign_id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  // Delegate to PageService
  const donationPage = await pageService.createDonationPage(req.body.campaign_id, req.body, {});
  
  sendCreated(res, { pageId: donationPage.id }, 'Donation page created successfully');
})

export const updateDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  // Handle file upload
  await handlePageFileUpload(req, res, getImageFieldsForPageType('donation-page'));
  
  // Delegate to PageService
  const donationPage = await pageService.updateDonationPage(id, req.body, req.files);
  
  sendUpdated(res, { pageId: donationPage.id }, 'Donation page updated successfully');
})

export const getDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  try {
    // Delegate to PageService
    const donationPage = await pageService.getDonationPage(id);
    
    sendSuccess(res, donationPage, 'Donation page retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Donation page not found');
    } else {
      throw error;
    }
  }
})