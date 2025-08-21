import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

export const createTicketPurchasePage = asyncHandler(async (req, res) => {
  const { campaign_id, user_id } = req.body;
  
  if (!campaign_id || !user_id) {
    throw new ValidationError('Missing required fields: campaign_id, user_id');
  }

  const query = "INSERT INTO ticket_purchase_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?, ?, ?)"

  const values = [
    campaign_id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    user_id
  ]  
  
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create ticket purchase page', err));
        return;
      }
      sendCreated(res, { pageId: data.insertId }, 'Ticket purchase page created successfully');
      resolve();
    })
  })
})

export const updateTicketPurchasePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { headline, description, bg_color, p_color, s_color, t_color } = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "UPDATE ticket_purchase_pages SET `headline` = ?, `description` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `t_color` = ? WHERE `campaign_id` = ?"
  const values = [
    headline,
    description,
    bg_color,
    p_color,
    s_color,
    t_color,
    id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to update ticket purchase page', err));
        return;
      }
      if (data.affectedRows === 0) {
        reject(new NotFoundError('Ticket purchase page'));
        return;
      }
                     sendUpdated(res, { success: true }, 'Ticket purchase page updated successfully');
      resolve();
    })
  })
})

export const getTicketPurchasePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM ticket_purchase_pages WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch ticket purchase page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Ticket purchase page'));
        return;
      }
      sendSuccess(res, data[0], 'Ticket purchase page retrieved successfully');
      resolve();
    })
  })
})