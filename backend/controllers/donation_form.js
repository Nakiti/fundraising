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
      sendCreated(res, { formId: data.insertId }, 'Donation form created successfully');
      resolve();
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
      sendSuccess(res, data[0], 'Donation form retrieved successfully');
      resolve();
    })
  })
})

export const updateDonationForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Form ID is required');
  }

  return new Promise((resolve, reject) => {
    upload.single('bg_image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      // Destructure after multer has processed the form data
      const { 
        bg_image, headline, description, button1, button2, button3, 
        button4, button5, button6, p_color, s_color, bg_color, t_color, b1_color,
        heroTitleSize, sectionTitleSize, bodyTextSize, buttonTextSize,
        cardRadius, buttonRadius, user_id 
      } = req.body;
      
      if (!user_id) {
        reject(new ValidationError('Missing required field: user_id'));
        return;
      }

      const imagePath = req.file?.path || bg_image;

      const query = "UPDATE donation_forms SET `bg_image` = ?, `headline` = ?, `description` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `b1_color` = ?, `heroTitleSize` = ?, `sectionTitleSize` = ?, `bodyTextSize` = ?, `buttonTextSize` = ?, `cardRadius` = ?, `buttonRadius` = ?, `updated_at` = ?, `updated_by` = ? WHERE `campaign_id` = ?"

      const values = [
        imagePath,
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
        b1_color,
        heroTitleSize,
        sectionTitleSize,
        bodyTextSize,
        buttonTextSize,
        cardRadius,
        buttonRadius,
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        user_id,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          console.error('SQL Error:', err);
          console.error('Query:', query);
          console.error('Values:', values);
          reject(new DatabaseError(`SQL Error: ${err.message}`, err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Donation form'));
          return;
        }
        sendUpdated(res, data, 'Donation form updated successfully');
        resolve();
      })
    })
  })
})

