import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { 
  sendCreated, 
  sendUpdated, 
  sendSuccess
} from "../utils/response.js";
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from "../utils/errors.js";
import { getCampaignService } from "../services/ServiceRegistry.js";

// Temporary compatibility: forward detail updates to campaigns table
const campaignService = getCampaignService();

export const createCampaignDetails = asyncHandler(async (req, res) => {
   // Validate required fields
   const { campaign_id, internalName, type, user_id } = req.body;
   
   if (!campaign_id || !internalName || !type || !user_id) {
      throw new ValidationError('Missing required fields: campaign_id, internalName, type, user_id');
   }

   const query = "INSERT INTO campaign_details (`campaign_id`, `internal_name`, `raised`, `visits`, `donations`, `status`, `type`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      campaign_id,
      internalName,
      0,
      0,
      0,
      "inactive",
      type,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      user_id
   ]

   return new Promise((resolve, reject) => {
      db.query(query, [values], (err, data) => {
         if (err) {
            reject(new DatabaseError('Failed to create campaign details', err));
         } else {
            sendCreated(res, { campaignId: data.insertId }, 'Campaign details created successfully');
      resolve();
         }
      });
   });
});

export const updateCampaignDetails = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      throw new ValidationError('Campaign ID is required');
   }

   const {
      internalName,
      externalName,
      goal,
      defaultDesignation,
      status,
      url,
      userId,
      showPhone,
      showTitle,
      showSuffix,
      showCompanyName,
      showWebsiteUrl
   } = req.body;

   if (!internalName || !userId) {
      throw new ValidationError('Missing required fields: internalName, userId');
   }

   // Map camelCase body to campaigns snake_case columns
   const updateData = {
      internal_name: internalName,
      external_name: externalName,
      goal: goal,
      default_designation: defaultDesignation,
      status: status,
      url: url,
      show_phone: !!showPhone,
      show_title: !!showTitle,
      show_suffix: !!showSuffix,
      show_company_name: !!showCompanyName,
      show_website_url: !!showWebsiteUrl,
      updated_by: userId
   };

   if (url) {
      await campaignService.validateUniqueUrl(url, id);
   }

   const updated = await campaignService.update(id, updateData);
   sendUpdated(res, updated, 'Campaign details updated successfully');
});

export const getCampaignDetails = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      throw new ValidationError('Campaign ID is required');
   }
   const campaign = await campaignService.findById(id);
   if (!campaign) {
      throw new NotFoundError('Campaign');
   }
   sendSuccess(res, campaign, 'Campaign details retrieved successfully');
});