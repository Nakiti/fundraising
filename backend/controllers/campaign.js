import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendConflict,
  sendValidationError
} from "../utils/response.js"
import { getCampaignService } from "../services/ServiceRegistry.js"

// Initialize service
const campaignService = getCampaignService()

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  sendCreated(res, { campaignId: campaign.id }, 'Campaign created successfully');
})

export const getCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await campaignService.getCampaignWithDetails(id);
  sendSuccess(res, campaign, 'Campaign retrieved successfully');
})

export const searchCampaigns = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { id: organizationId } = req.params;
  
  const campaigns = await campaignService.searchCampaigns(q, organizationId);
  sendSuccess(res, campaigns, 'Campaign search completed');
})

export const getCampaignsByOrg = asyncHandler(async (req, res) => {
  const { id: organizationId } = req.params;
  const campaigns = await campaignService.getCampaignsByOrganization(organizationId);
  sendSuccess(res, campaigns, 'Organization campaigns retrieved successfully');
})

export const getActive = asyncHandler(async (req, res) => {
  // Get active campaigns by using a custom query since status is in campaign_details
  const query = `
    SELECT campaigns.*, campaign_details.internal_name, campaign_details.external_name, campaign_details.status
    FROM campaigns 
    LEFT JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    WHERE campaign_details.status = 'active'
    ORDER BY campaigns.created_at DESC
  `;
  const campaigns = await campaignService.executeQuery(query);
  sendSuccess(res, campaigns, 'Active campaigns retrieved successfully');
})

export const getFiltered = asyncHandler(async (req, res) => {
  const { status, type, limit, offset } = req.query;
  const { id: organizationId } = req.params;
  
  const filters = {
    status: status && status !== "all" ? status : undefined,
    type: type && type !== "all" ? type : undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined
  };
  
  const campaigns = await campaignService.getFilteredCampaigns(organizationId, filters);
  sendSuccess(res, campaigns, 'Filtered campaigns retrieved successfully');
})

export const getDateRange = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const { id: organizationId } = req.params;
  
  if (!start || !end) {
    return sendValidationError(res, { start: 'required', end: 'required' }, 'Start and end dates are required');
  }
  
  const campaigns = await campaignService.getCampaignsByDateRange(
    organizationId, 
    new Date(start), 
    new Date(end)
  );
  sendSuccess(res, campaigns, 'Date range campaigns retrieved successfully');
})

export const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url, updated_by, ...updateData } = req.body;
  
  // Validate URL uniqueness if provided
  if (url) {
    await campaignService.validateUniqueUrl(url, id);
  }
  
  // Update campaign with provided data
  const campaign = await campaignService.update(id, {
    url,
    updated_by,
    ...updateData
  });
  
  sendUpdated(res, campaign, 'Campaign updated successfully');
})

export const deactivateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { updatedBy } = req.body;
  
  const campaign = await campaignService.deactivateCampaign(id, updatedBy);
  sendUpdated(res, campaign, 'Campaign deactivated successfully');
})

export const sumDonations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await campaignService.getCampaignStats(id);
  sendSuccess(res, { total_donations: stats.total_raised }, 'Donations sum calculated successfully');
})

export const sumRaised = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await campaignService.getCampaignStats(id);
  sendSuccess(res, { total_raised: stats.total_raised }, 'Raised amount calculated successfully');
})

export const getCampaignInsights = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // For now, use the basic stats. This can be enhanced later with detailed insights
  const stats = await campaignService.getCampaignStats(id);
  
  // Basic insights structure - can be enhanced with campaign details
  const insights = {
    total_raised: stats.total_raised,
    total_transactions: stats.total_donations,
    unique_donors: stats.unique_donors,
    average_donation: stats.average_donation,
    // Additional calculations can be added here
    conversion_rate: 0, // Would need visit data
    percentage_funded: 0, // Would need goal data
    gross_amount: stats.total_raised,
    net_amount: stats.total_raised
  };
  
  sendSuccess(res, insights, 'Campaign insights retrieved successfully');
})