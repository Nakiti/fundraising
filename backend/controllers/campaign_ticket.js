import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

export const createCampaignTicketBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tickets = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
    throw new ValidationError('Tickets array is required and must not be empty');
  }

  const query = "INSERT INTO campaign_tickets (`campaign_id`, `title`, `quantity`, `price`, `description`, `attendees`, `max_purchase`, `start_date`, `end_date`, `created_at`) VALUES ?"
  
  const values = tickets.map(ticket => [
    Number(id),
    ticket.title,
    ticket.quantity,
    ticket.price,
    ticket.description,
    ticket.attendees,
    ticket.max_purchase,
    ticket.start_date,
    ticket.end_date,
    (new Date()).toISOString().slice(0, 19).replace('T', ' ')
  ])
  
  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create campaign tickets', err));
      resolve(sendCreated(res, { insertedCount: data.affectedRows }, 'Campaign tickets created successfully'));
    })
  })
})

export const deleteCampaignTicketsBatch = asyncHandler(async (req, res) => {
  const items = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required and must not be empty');
  }

  const query = "DELETE FROM campaign_tickets WHERE `id` IN (?)"

  const values = items.map(item => item.id)

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete campaign tickets batch', err));
      resolve(sendDeleted(res, `Deleted ${data.affectedRows} campaign tickets successfully`));
    })
  })
})

export const getCampaignTickets = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM campaign_tickets WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch campaign tickets', err));
      resolve(sendSuccess(res, data, 'Campaign tickets retrieved successfully'));
    })
  })
})