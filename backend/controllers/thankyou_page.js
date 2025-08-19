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
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const createThankYouPage = asyncHandler(async (req, res) => {
  const { campaign_id, user_id } = req.body;
  
  if (!campaign_id || !user_id) {
    throw new ValidationError('Missing required fields: campaign_id, user_id');
  }

  const query = "INSERT INTO thankyou_pages (`campaign_id`, `updated_at`, `updated_by`) VALUES (?, ?, ?)"

  const values = [
    campaign_id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    user_id
  ]  
  
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create thank you page', err));
        return;
      }
      sendCreated(res, { pageId: data.insertId }, 'Thank you page created successfully');
      resolve();
    })
  })
})

export const updateThankYouPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    headline, description, bg_image, bg_color, p_color, s_color,
    heroTitleSize, bodyTextSize, buttonTextSize, cardRadius, buttonRadius
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

      const imagePath = req.file?.path || bg_image;

      const query = "UPDATE thankyou_pages SET `headline` = ?, `description` = ?, `bg_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `heroTitleSize` = ?, `bodyTextSize` = ?, `buttonTextSize` = ?, `cardRadius` = ?, `buttonRadius` = ? WHERE `campaign_id` = ?"

      const values = [
        headline,
        description,
        imagePath,
        bg_color,
        p_color,
        s_color,
        heroTitleSize,
        bodyTextSize,
        buttonTextSize,
        cardRadius,
        buttonRadius,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update thank you page', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Thank you page'));
          return;
        }
        sendUpdated(res, data, 'Thank you page updated successfully');
      resolve();
      })
    })
  })
})

export const getThankYouPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM thankyou_pages WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch thank you page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Thank you page'));
        return;
      }
      sendSuccess(res, data[0], 'Thank you page retrieved successfully');
      resolve();
    })
  })
})