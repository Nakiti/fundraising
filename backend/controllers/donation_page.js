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
      sendSuccess(res, data[0], 'Donation page retrieved successfully');
      resolve();
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
    ])(req, res, (err) => {
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

      const bannerImagePath = req.files?.banner_image?.[0]?.path || banner_image;
      const smallImagePath = req.files?.small_image?.[0]?.path || small_image;

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
        sendUpdated(res, data, 'Donation page updated successfully');
        resolve();
      })
    })
  })
})

