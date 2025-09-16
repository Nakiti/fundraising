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

export const createDonationForm = asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.campaign_id) {
    throw new ValidationError('Campaign ID is required');
  }
  // if (!req.body.user_id) {
  //   throw new ValidationError('User ID is required');
  // }
  
  // Add updated_at and updated_by fields
  const pageData = {
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_by: req.body.user_id
  };
   
  // Delegate to PageService
  const donationForm = await pageService.createDonationForm(req.body.campaign_id);
  
  sendCreated(res, { formId: donationForm.id }, 'Donation form created successfully'); 
})

export const updateDonationForm = asyncHandler(async (req, res) => {
  const { organizationId, campaignId, pageId } = req.params;
  
  if (!organizationId || !campaignId || !pageId) {
    throw new ValidationError('Form ID is required'); 
  }
  // if (!req.body.user_id) {
  //   throw new ValidationError('User ID is required');
  // }
  
  // Handle file upload (single file for bg_image)
  await handlePageFileUpload(req, res, getImageFieldsForPageType('donation-form'));
  
  // Add updated_at and updated_by fields
  const pageData = {
    ...req.body,
    // updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    // updated_by: req.body.user_id
  };
  
  // Delegate to PageService
  const donationForm = await pageService.updateDonationForm(organizationId, campaignId, pageId, pageData, req.files);
  
  sendUpdated(res, { formId: donationForm.id }, 'Donation form updated successfully');
})

export const getDonationForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { includeTheme = 'true' } = req.query;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required'); 
  }
  
  try {
    // Delegate to PageService with theme support
    const donationForm = await pageService.getPageWithTheme('donation-form', id, 'campaign_id', includeTheme === 'true');
    
    sendSuccess(res, donationForm, 'Donation form retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Donation form not found');
    } else {
      throw error;
    }
  }
})