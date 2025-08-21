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
import imageService from "../services/imageService.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024
  }, // 5MB limit
});

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
    upload.single('image')(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      try {
        // First, get current thank you page to access existing image path and organization_id
        const getQuery = "SELECT typ.*, c.organization_id FROM thankyou_pages typ JOIN campaigns c ON typ.campaign_id = c.id WHERE typ.campaign_id = ?";
        
        db.query(getQuery, [id], async (err, data) => {
          if (err) {
            reject(new DatabaseError('Failed to fetch thank you page', err));
            return;
          }
          
          if (!data || data.length === 0) {
            reject(new NotFoundError('Thank you page'));
            return;
          }

          const currentPage = data[0];
          const organization_id = currentPage.organization_id;

          // Handle image update
          let bgImagePath = currentPage.bg_image;

          if (req.file) {
            imageService.validateFile(req.file);
            bgImagePath = await imageService.updateImage(organization_id, 'thankyou-pages', id, 'background', req.file, currentPage.bg_image);
          }

          const query = "UPDATE thankyou_pages SET `headline` = ?, `description` = ?, `bg_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `heroTitleSize` = ?, `bodyTextSize` = ?, `buttonTextSize` = ?, `cardRadius` = ?, `buttonRadius` = ? WHERE `campaign_id` = ?"

          const values = [
            headline,
            description,
            bgImagePath,
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
                           sendUpdated(res, { success: true }, 'Thank you page updated successfully');
            resolve();
          })
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process thank you page update', error));
      }
    })
  })
})

export const getThankYouPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM thankyou_pages WHERE `campaign_id` = ?"

  return new Promise(async (resolve, reject) => {
    db.query(query, [id], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch thank you page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Thank you page'));
        return;
      }

      try {
        const thankYouPage = data[0];
        
        // Generate SAS URL for background image (or return local path in development)
        const bgImageUrl = await imageService.getImageUrl(thankYouPage.bg_image, 'public');

        // Replace image path with URL
        const result = {
          ...thankYouPage,
          bg_image: bgImageUrl
        };

        sendSuccess(res, result, 'Thank you page retrieved successfully');
        resolve();
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URL', error));
      }
    })
  })
})