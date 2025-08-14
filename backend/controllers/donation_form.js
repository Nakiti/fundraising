import { db } from "../db.js"
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
  }, // 5MB limit
});

export const createDonationForm = asyncHandler(async (req, res) => {
  const { campaign_id, user_id } = req.body;
  
  if (!campaign_id || !user_id) {
    throw new ValidationError('Missing required fields: campaign_id, user_id');
  }

  const query = "INSERT INTO donation_forms (`campaign_id`, `updated_at`, `updated_by`) VALUES (?, ?, ?)"

  const values = [
    campaign_id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    user_id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create donation form', err));
        return;
      }
      resolve(sendCreated(res, { formId: data.insertId }, 'Donation form created successfully'));
    })
  })
})

export const getDonationForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM donation_forms WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch donation form', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Donation form'));
        return;
      }
      resolve(sendSuccess(res, data[0], 'Donation form retrieved successfully'));
    })
  })
})

export const updateDonationForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    bg_image, headline, description, button1, button2, button3, 
    button4, button5, button6, p_color, s_color, bg_color, t_color, user_id 
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

      const query = "UPDATE donation_forms SET `bg_image` = ?, `headline` = ?, `description` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

      const values = [
        bg_image,
        headline,
        description,
        button1,
        button2,
        button3,
        button4, 
        button5,
        button6,
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
          reject(new DatabaseError('Failed to update donation form', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Donation form'));
          return;
        }
        resolve(sendUpdated(res, data, 'Donation form updated successfully'));
      })
    })
  })
})

