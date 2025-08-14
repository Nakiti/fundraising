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

export const createDonationPage = asyncHandler(async (req, res) => {
  const { campaign_id } = req.body;
  
  if (!campaign_id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "INSERT INTO donation_pages (`campaign_id`) VALUES (?)"

  const values = [campaign_id]

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to create donation page', err));
        return;
      }
      resolve(sendCreated(res, { pageId: data.insertId }, 'Donation page created successfully'));
    })
  })
})

export const getDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM donation_pages WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch donation page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Donation page'));
        return;
      }
      resolve(sendSuccess(res, data[0], 'Donation page retrieved successfully'));
    })
  })
})

export const updateDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    headline, description, banner_image, small_image, bg_color, p_color, s_color,
    b1_color, b2_color, b3_color, button1, button2, button3, button4, button5, button6
  } = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: 'banner_image', maxCount: 1 },
      { name: 'small_image', maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      const bannerImagePath = req.files?.banner_image?.[0]?.path || banner_image;
      const smallImagePath = req.files?.small_image?.[0]?.path || small_image;

      const query = "UPDATE donation_pages SET `headline` = ?, `description` = ?, `banner_image` = ?, `small_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ?, `b2_color` = ?, `b3_color` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?  WHERE `campaign_id` = ?"

      const values = [
        headline,
        description,
        bannerImagePath,
        smallImagePath,
        bg_color,
        p_color,
        s_color,
        b1_color,
        b2_color,
        b3_color,
        button1,
        button2,
        button3,
        button4,
        button5,
        button6,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update donation page', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Donation page'));
          return;
        }
        resolve(sendUpdated(res, data, 'Donation page updated successfully'));
      })
    })
  })
})

