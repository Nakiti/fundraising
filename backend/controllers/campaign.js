import { db } from "../db.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendConflict,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError
} from "../utils/errors.js"

export const createCampaign = asyncHandler(async (req, res) => {
  const { organization_id, created_by } = req.body;
  
  if (!organization_id || !created_by) {
    throw new ValidationError('Missing required fields: organization_id, created_by');
  }

  const q = "SELECT * FROM campaigns WHERE url = ?" //need to check url isnt already taken
  // if (data.length > 0) return res.status(409).json("Short URL already in use") 

  const query = "INSERT INTO campaigns (`organization_id`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (?)"

  const values = [
    organization_id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    created_by,
    created_by,
  ]
      
  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create campaign', err));
      resolve(sendCreated(res, { campaignId: data.insertId }, 'Campaign created successfully'));
    })
  })
})

export const getCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = `
    SELECT 
      campaigns.*, campaign_details.*,       
      creator.first_name AS creator_first_name, 
      creator.last_name AS creator_last_name, 
      updater.first_name AS updater_first_name, 
      updater.last_name AS updater_last_name 
    FROM campaigns 
    INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    INNER JOIN users AS creator ON campaigns.created_by = creator.id
    INNER JOIN users AS updater ON campaigns.updated_by = updater.id 
    WHERE campaigns.id = ?
  `

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch campaign', err));
      if (!data || data.length === 0) reject(new NotFoundError('Campaign'));
      resolve(sendSuccess(res, data[0], 'Campaign retrieved successfully'));
    })
  })
})

export const searchCampaigns = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { id } = req.params;
  
  if (!q) {
    throw new ValidationError('Search query is required');
  }
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT campaigns.id, campaigns.created_at, campaign_details.*
    FROM campaigns
    INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    WHERE (internal_name LIKE ? OR external_name LIKE ?) AND campaigns.organization_id = ?
  `
  const values = [`%${q}%`, `%${q}%`, id]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to search campaigns', err));
      resolve(sendSuccess(res, data, 'Campaigns search completed'));
    })
  })
})

export const getCampaignsByOrg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT campaigns.id, campaigns.created_at, campaign_details.internal_name, campaign_details.external_name, campaign_details.visits, campaign_details.type, campaign_details.status, SUM(transactions.amount) AS amount_raised
    FROM campaigns
    INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    LEFT JOIN transactions ON campaigns.id = transactions.campaign_id
    WHERE campaigns.organization_id = ?
    GROUP BY campaigns.id, campaigns.created_at, campaign_details.internal_name, campaign_details.external_name, campaign_details.visits, campaign_details.type, campaign_details.status
    ORDER BY campaigns.id DESC
  `

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch organization campaigns', err));
      resolve(sendSuccess(res, data, 'Organization campaigns retrieved successfully'));
    })
  })
})

export const getActive = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM campaigns WHERE status = 'active'"

  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch active campaigns', err));
      resolve(sendSuccess(res, data, 'Active campaigns retrieved successfully'));
    })
  })
})

export const getFiltered = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  const params = [id];

  let query = `
    SELECT campaigns.id, campaigns.created_at, campaign_details.*
    FROM campaigns
    INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    WHERE campaigns.organization_id = ?
  `

  if (status && status !== "all") {
    query += " AND campaign_details.status = ?"
    params.push(status)
  }

  if (type && type != "all") {
    query += " AND campaign_details.type = ?"
    params.push(type)
  }

  query += " ORDER BY campaigns.id DESC"

  return new Promise((resolve, reject) => {
    db.query(query, params, (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch filtered campaigns', err));
      resolve(sendSuccess(res, data, 'Filtered campaigns retrieved successfully'));
    })
  })
})

export const getDateRange = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const { id } = req.params;
  
  if (!start || !end) {
    throw new ValidationError('Start and end dates are required');
  }
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT campaigns.id, campaigns.created_at, campaign_details.*
    FROM campaigns
    INNER JOIN campaign_details ON campaigns.id = campaign_details.campaign_id
    WHERE created_at BETWEEN ? AND ? AND organization_id = ?
  `
  const values = [start, end, id]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch campaigns by date range', err));
      resolve(sendSuccess(res, data, 'Date range campaigns retrieved successfully'));
    })
  })
})

export const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url, defaultDesignation, campaignName, internalName, goal, status, updated_by } = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!url || !updated_by) {
    throw new ValidationError('Missing required fields: url, updated_by');
  }

  const q = "SELECT * FROM campaigns WHERE url = ?"

  return new Promise((resolve, reject) => {
    db.query(q, [url], (err, data) => {
      if (err) reject(new DatabaseError('Failed to check URL availability', err));
      if (data.length > 0 && data[0].id != id) reject(new ConflictError('Short URL already in use'));

      const query = "UPDATE campaigns SET `default_designation` = ?, `campaign_name` = ?, `internal_name` = ?, `goal` = ?, `status` = ?, `updated_at` = ?, `updated_by` = ?, `url` = ? WHERE `id` = ?"

      const values = [
        defaultDesignation,
        campaignName,
        internalName,
        goal,
        status,
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        updated_by,
        url,
        id 
      ]

      db.query(query, values, (err, data) => {
        if (err) reject(new DatabaseError('Failed to update campaign', err));
        if (data.affectedRows === 0) reject(new NotFoundError('Campaign'));
        resolve(sendUpdated(res, data, 'Campaign updated successfully'));
      })
    })
  })
})

export const deactivateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { updatedBy } = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!updatedBy) {
    throw new ValidationError('Updated by user ID is required');
  }

  const query = "UPDATE campaigns SET `status` = 'inactive', `updated_by` = ?, `updated_at` = ? WHERE id = ?"

  const values = [
    updatedBy,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to deactivate campaign', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Campaign'));
      resolve(sendUpdated(res, data, 'Campaign deactivated successfully'));
    })
  })
})

export const sumDonations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT SUM(amount) as total_donations FROM transactions WHERE campaign_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to calculate donations sum', err));
      resolve(sendSuccess(res, data[0], 'Donations sum calculated successfully'));
    })
  })
})

export const sumRaised = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT SUM(amount) as total_raised FROM transactions WHERE campaign_id = ? AND status = 'completed'"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to calculate raised amount', err));
      resolve(sendSuccess(res, data[0], 'Raised amount calculated successfully'));
    })
  })
})