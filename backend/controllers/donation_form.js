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
import imageService from "../services/imageService.js"

const upload = multer({
  storage: multer.memoryStorage(),
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

  return new Promise(async (resolve, reject) => {
    db.query(query, [id], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch donation form', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Donation form'));
        return;
      }

      try {
        const donationForm = data[0];
        
        // Generate SAS URL for background image (or return local path in development)
        const bgImageUrl = await imageService.getImageUrl(donationForm.bg_image, 'public');

        // Replace image path with URL
        const result = {
          ...donationForm,
          bg_image: bgImageUrl
        };

        sendSuccess(res, result, 'Donation form retrieved successfully');
        resolve();
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URL', error));
      }
    })
  })
})

export const updateDonationForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Form ID is required');
  }

  return new Promise((resolve, reject) => {
    upload.single('bg_image')(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      try {
        // First, get current donation form to access existing image path and organization_id
        const getQuery = "SELECT df.*, c.organization_id FROM donation_forms df JOIN campaigns c ON df.campaign_id = c.id WHERE df.id = ?";
        
        db.query(getQuery, [id], async (err, data) => {
          if (err) {
            reject(new DatabaseError('Failed to fetch donation form', err));
            return;
          }
          
          if (!data || data.length === 0) {
            reject(new NotFoundError('Donation form'));
            return;
          }

          const currentForm = data[0];
          const organization_id = currentForm.organization_id;

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

          // Handle image update
          let bgImagePath = currentForm.bg_image;

          if (req.file) {
            imageService.validateFile(req.file);
            bgImagePath = await imageService.updateImage(organization_id, 'donation-forms', id, 'background', req.file, currentForm.bg_image);
          }

          const query = "UPDATE donation_forms SET `bg_image` = ?, `headline` = ?, `description` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?, `p_color` = ?, `s_color` = ?, `bg_color` = ?, `t_color` = ?, `b1_color` = ?, `heroTitleSize` = ?, `sectionTitleSize` = ?, `bodyTextSize` = ?, `buttonTextSize` = ?, `cardRadius` = ?, `buttonRadius` = ?, `updated_at` = ?, `updated_by` = ? WHERE `id` = ?"

          const values = [
            bgImagePath,
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
                           sendUpdated(res, { success: true }, 'Donation form updated successfully');
            resolve();
          })
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process donation form update', error));
      }
    })
  })
})

