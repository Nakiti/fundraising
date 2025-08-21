import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { 
  sendCreated, 
  sendUpdated, 
  sendSuccess, 
  sendNotFound,
  sendDatabaseError 
} from "../utils/response.js";
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from "../utils/errors.js";

export const createCampaignDetails = asyncHandler(async (req, res) => {
   // Validate required fields
   const { campaign_id, internalName, type, user_id } = req.body;
   
   if (!campaign_id || !internalName || !type || !user_id) {
      throw new ValidationError('Missing required fields: campaign_id, internalName, type, user_id');
   }

   const query = "INSERT INTO campaign_details (`campaign_id`, `internal_name`, `raised`, `visits`, `status`, `type`, `updated_at`, `updated_by`) VALUES (?)"

   const values = [
      campaign_id,
      internalName,
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
   // Validate required fields
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
   const { id } = req.params;
   
   if (!id) {
      throw new ValidationError('Campaign ID is required');
   }

   if (!internalName || !userId) {
      throw new ValidationError('Missing required fields: internalName, userId');
   }

   const query = "UPDATE campaign_details SET `internal_name` = ?, `external_name` = ?, `goal` = ?, `default_designation` = ?, `status` = ?, `url` = ?, `show_phone` = ?, `show_title` = ?, `show_suffix` = ?, `show_company_name` = ?, `show_website_url` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

   const values = [
      internalName,
      externalName,
      goal,
      defaultDesignation,
      status,
      url,
      showPhone || false,
      showTitle || false,
      showSuffix || false,
      showCompanyName || false,
      showWebsiteUrl || false,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      userId,
      id
   ]

   return new Promise((resolve, reject) => {
      db.query(query, values, (err, data) => {
         if (err) {
            reject(new DatabaseError('Failed to update campaign details', err));
         } else {
            if (data.affectedRows === 0) {
               reject(new NotFoundError('Campaign details'));
            } else {
               sendUpdated(res, { success: true }, 'Campaign details updated successfully');
      resolve();
            }
         }
      });
   });
});

export const getCampaignDetails = asyncHandler(async (req, res) => {
   // Validate required fields
   const { id } = req.params;
   
   if (!id) {
      throw new ValidationError('Campaign ID is required');
   }

   const query = "SELECT * FROM campaign_details WHERE campaign_id = ?"
   const value = [id]

   return new Promise((resolve, reject) => {
      db.query(query, value, (err, data) => {
         if (err) {
            reject(new DatabaseError('Failed to fetch campaign details', err));
         } else {
            if (!data || data.length === 0) {
               reject(new NotFoundError('Campaign details'));
            } else {
               sendSuccess(res, data[0], 'Campaign details retrieved successfully');
      resolve();
            }
         }
      });
   });
});