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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const createPeerLandingPage = asyncHandler(async (req, res) => {
  const { campaign_id, user_id } = req.body;
  
  if (!campaign_id || !user_id) {
    throw new ValidationError('Missing required fields: campaign_id, user_id');
  }

  const query = "INSERT INTO peer_landing_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?, ?, ?)"

  const values = [
    campaign_id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    user_id   
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create peer landing page', err));
        return;
      }
      resolve(sendCreated(res, { pageId: data.insertId }, 'Peer landing page created successfully'));
    })
  })
})

export const updatePeerLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    headline, tagline, description, banner_image, 
    p_color, s_color, bg_color, t_color, user_id 
  } = req.body;
  
  if (!id || !user_id) {
    throw new ValidationError('Missing required fields: campaign_id, user_id');
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

      const query = "UPDATE peer_landing_pages SET `headline` = ?, `tagline` = ?, `description` = ?, `banner_image` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

      const values = [
        headline,
        tagline,
        description,
        banner_image,
        p_color,
        s_color,
        bg_color,
        t_color,
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        user_id,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update peer landing page', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Peer landing page'));
          return;
        }
        resolve(sendUpdated(res, data, 'Peer landing page updated successfully'));
      })
    })
  })
})

export const getPeerLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM peer_landing_pages WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch peer landing page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Peer landing page'));
        return;
      }
      resolve(sendSuccess(res, data[0], 'Peer landing page retrieved successfully'));
    })
  })
})