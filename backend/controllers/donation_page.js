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
      sendCreated(res, { pageId: data.insertId }, 'Donation page created successfully');
      resolve();
    })
  })
})

export const getDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  } 

  const query = "SELECT * FROM donation_pages WHERE `campaign_id` = ?"

  return new Promise(async (resolve, reject) => {
    db.query(query, [id], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch donation page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Donation page'));
        return;
      }

      try {
        const donationPage = data[0];
        
        // Generate SAS URLs for all images (or return local paths in development)
        const imageUrls = await Promise.all([
          imageService.getImageUrl(donationPage.banner_image, 'public'),
          imageService.getImageUrl(donationPage.small_image, 'public')
        ]);

        // Replace image paths with URLs
        const result = {
          ...donationPage,
          banner_image: imageUrls[0],
          small_image: imageUrls[1]
        };

        sendSuccess(res, result, 'Donation page retrieved successfully');
        resolve();
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URLs', error));
      }
    })
  })
}) 

export const updateDonationPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: 'banner_image', maxCount: 1 },
      { name: 'small_image', maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      } 

      try {
        // First, get current donation page to access existing image paths and organization_id
        const getQuery = "SELECT dp.*, c.organization_id FROM donation_pages dp JOIN campaigns c ON dp.campaign_id = c.id WHERE dp.campaign_id = ?";
        
        db.query(getQuery, [id], async (err, data) => {
          if (err) {
            reject(new DatabaseError('Failed to fetch donation page', err));
            return;
          }
          
          if (!data || data.length === 0) {
            reject(new NotFoundError('Donation page'));
            return;
          }

          const currentPage = data[0];
          const organization_id = currentPage.organization_id;

          // Destructure after multer has processed the form data
          const { 
            headline, description, subtitle, mainHeadline, mainText,
            banner_image, small_image, 
            bg_color, p_color, s_color, b1_color, b2_color, b3_color, bt_color,
            button1, button2, button3, button4, button5, button6,
            goal_amount, raised_amount, donor_count, days_left,
            show_progress, show_donor_count, show_days_left, show_amount_grid,
            donate_button_text, share_button_text,
            footer_text, privacy_policy_url, terms_of_service_url,
            heroTitleSize, heroSubtitleSize, sectionTitleSize, bodyTextSize, 
            buttonTextSize, cardTitleSize, heroHeight, sectionPadding, cardRadius, buttonRadius, overlayOpacity
          } = req.body;

          // Handle image updates
          let bannerImagePath = currentPage.banner_image;
          let smallImagePath = currentPage.small_image;

          if (req.files?.banner_image?.[0]) {
            imageService.validateFile(req.files.banner_image[0]);
            bannerImagePath = await imageService.updateImage(organization_id, 'donation-pages', id, 'banner', req.files.banner_image[0], currentPage.banner_image);
          }

          if (req.files?.small_image?.[0]) {
            imageService.validateFile(req.files.small_image[0]);
            smallImagePath = await imageService.updateImage(organization_id, 'donation-pages', id, 'small', req.files.small_image[0], currentPage.small_image);
          }

          const query = "UPDATE donation_pages SET `headline` = ?, `description` = ?, `subtitle` = ?, `mainHeadline` = ?, `mainText` = ?, `banner_image` = ?, `small_image` = ?, `bg_color` = ?, `p_color` = ?, `s_color` = ?, `b1_color` = ?, `b2_color` = ?, `b3_color` = ?, `bt_color` = ?, `button1` = ?, `button2` = ?, `button3` = ?, `button4` = ?, `button5` = ?, `button6` = ?, `goal_amount` = ?, `raised_amount` = ?, `donor_count` = ?, `days_left` = ?, `donate_button_text` = ?, `share_button_text` = ?, `footer_text` = ?, `privacy_policy_url` = ?, `terms_of_service_url` = ?, `heroTitleSize` = ?, `heroSubtitleSize` = ?, `sectionTitleSize` = ?, `bodyTextSize` = ?, `buttonTextSize` = ?, `cardTitleSize` = ?, `heroHeight` = ?, `sectionPadding` = ?, `cardRadius` = ?, `buttonRadius` = ?, `overlayOpacity` = ? WHERE `campaign_id` = ?"

          const values = [
            headline,
            description,
            subtitle,
            mainHeadline,
            mainText,
            bannerImagePath,
            smallImagePath,
            bg_color,
            p_color,
            s_color,
            b1_color,
            b2_color,
            b3_color,
            bt_color,
            button1,
            button2,
            button3, 
            button4,
            button5,
            button6,
            goal_amount,
            raised_amount,
            donor_count,
            days_left,
            donate_button_text,
            share_button_text,
            footer_text,
            privacy_policy_url,
            terms_of_service_url,
            heroTitleSize,
            heroSubtitleSize,
            sectionTitleSize,
            bodyTextSize,
            buttonTextSize,
            cardTitleSize,
            heroHeight,
            sectionPadding,
            cardRadius,
            buttonRadius,
            overlayOpacity,
            id
          ]

          db.query(query, values, (err, data) => {
            if (err) {
              console.error('SQL Error:', err);
              // Pass the actual SQL error message directly
              reject(new DatabaseError(`SQL Error: ${err.message}`, err));
              return;
            }
            if (data.affectedRows === 0) {
              reject(new NotFoundError('Donation page'));
              return;
            }
                           sendUpdated(res, { success: true }, 'Donation page updated successfully');
            resolve();
          })
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process donation page update', error));
      }
    })
  })
})

