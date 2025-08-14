import { db } from "../db.js";
import multer from "multer"
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

const upload = multer({
  dest: 'uploads/',
  limits: { 
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024
  }, 
})

export const createTicketPage = asyncHandler(async (req, res) => {
  const { campaignId } = req.body;
  
  if (!campaignId) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "INSERT INTO ticket_pages (`campaign_id`) VALUES (?)"

  return new Promise((resolve, reject) => {
    db.query(query, [campaignId], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create ticket page', err));
        return;
      }
      resolve(sendCreated(res, { pageId: data.insertId }, 'Ticket page created successfully'));
    })
  })
})

export const getTicketPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM ticket_pages WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch ticket page', err));
        return;
      }
      
      if (!data || data.length === 0) {
        reject(new NotFoundError('Ticket page not found'));
        return;
      }
      
      resolve(sendSuccess(res, data[0], 'Ticket page retrieved successfully'));
    })
  })
})

export const updateTicketPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, date, address, bgImage, aboutDescription, venueName, instructions,
    bg_color, bg_color2, p_color, s_color, b1_color
  } = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      const query = "UPDATE ticket_pages SET `title` = ?, `date` = ?, `address` = ?, `bgImage` = ?, `aboutDescription` = ?, `venueName` = ?, `instructions` = ?, `bg_color` = ?, `bg2_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ? WHERE `campaign_id` = ?"

      const values = [
        title,
        date,
        address,
        bgImage,
        aboutDescription,
        venueName,
        instructions,
        bg_color,
        bg_color2,
        p_color,
        s_color,
        b1_color,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update ticket page', err));
          return;
        }
        
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Ticket page not found'));
          return;
        }
        
        resolve(sendUpdated(res, data, 'Ticket page updated successfully'));
      })
    })
  })
})