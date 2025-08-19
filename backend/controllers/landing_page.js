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

export const createLandingPage = asyncHandler(async (req, res) => {
  const { 
    organization_id, 
    title, 
    description, 
    about,
    mainHeadline,
    mainText,
    impactText,
    headlineOne,
    descriptionOne,
    headlineTwo,
    descriptionTwo,
    headlineThree,
    descriptionThree,
    // Color customization
    bg_color, 
    p_color, 
    s_color, 
    c_color, 
    ct_color, 
    b_color, 
    bt_color,
    // Font sizes
    hero_title_size,
    hero_subtitle_size,
    section_title_size,
    body_text_size,
    button_text_size,
    card_title_size,
    // Layout & spacing
    hero_height,
    section_padding,
    card_radius,
    button_radius,
    // Visual effects
    overlay_opacity,
    accent_color,
    // Element visibility toggles
    show_video_button,
    show_hero_icons,
    show_feature_icons,
    show_campaign_badges,
    show_trust_badge,
    show_progress_indicators,
    show_statistics,
    show_hover_effects
  } = req.body;
  
  if (!organization_id || !title) {
    throw new ValidationError('Missing required fields: organization_id, title');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 },
      { name: "textImage", maxCount: 1 },
      { name: "imageOne", maxCount: 1 },
      { name: "imageTwo", maxCount: 1 },
      { name: "imageThree", maxCount: 1 }
    ])(req, res, async (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      }

      try {
        // Handle image uploads
        let bgImagePath = null;
        let aboutImagePath = null;
        let textImagePath = null;
        let imageOnePath = null;
        let imageTwoPath = null;
        let imageThreePath = null;

        // Upload images if provided
        if (req.files?.bgImage?.[0]) {
          imageService.validateFile(req.files.bgImage[0]);
          bgImagePath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'banner', req.files.bgImage[0]);
        }

        if (req.files?.aboutImage?.[0]) {
          imageService.validateFile(req.files.aboutImage[0]);
          aboutImagePath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'about', req.files.aboutImage[0]);
        }

        if (req.files?.textImage?.[0]) {
          imageService.validateFile(req.files.textImage[0]);
          textImagePath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'impact', req.files.textImage[0]);
        }

        if (req.files?.imageOne?.[0]) {
          imageService.validateFile(req.files.imageOne[0]);
          imageOnePath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'triple', req.files.imageOne[0]);
        }

        if (req.files?.imageTwo?.[0]) {
          imageService.validateFile(req.files.imageTwo[0]);
          imageTwoPath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'triple', req.files.imageTwo[0]);
        }

        if (req.files?.imageThree?.[0]) {
          imageService.validateFile(req.files.imageThree[0]);
          imageThreePath = await imageService.uploadImage(organization_id, 'landing-pages', 'temp', 'triple', req.files.imageThree[0]);
        }

        const query = `INSERT INTO landing_pages (
          organization_id, title, description, bgImage, aboutImage, about,
          mainHeadline, mainText, impactText, textImage,
          headlineOne, descriptionOne, imageOne,
          headlineTwo, descriptionTwo, imageTwo,
          headlineThree, descriptionThree, imageThree,
          bg_color, p_color, s_color, c_color, ct_color, b_color, bt_color,
          hero_title_size, hero_subtitle_size, section_title_size, body_text_size, button_text_size, card_title_size,
          hero_height, section_padding, card_radius, button_radius,
          overlay_opacity, accent_color,
          show_video_button, show_hero_icons, show_feature_icons, show_campaign_badges, show_trust_badge, show_progress_indicators, show_statistics, show_hover_effects
        ) VALUES (?)`

      const values = [
        organization_id,
        title,
        description,
          bgImagePath,
          aboutImagePath, 
        about,
          mainHeadline,
          mainText,
          impactText,
          textImagePath,
          headlineOne,
          descriptionOne,
          imageOnePath,
          headlineTwo,
          descriptionTwo,
          imageTwoPath,
          headlineThree,
          descriptionThree,
          imageThreePath,
          bg_color,
        p_color,
        s_color,
        c_color,
        ct_color,
        b_color,
          bt_color,
          hero_title_size || '36px',
          hero_subtitle_size || '16px',
          section_title_size || '28px',
          body_text_size || '14px',
          button_text_size || '14px',
          card_title_size || '18px',
          hero_height || '500px',
          section_padding || '80px',
          card_radius || '4px',
          button_radius || '4px',
          overlay_opacity || 0.3,
          accent_color || '#1F2937',
          show_video_button !== false,
          show_hero_icons !== false,
          show_feature_icons !== false,
          show_campaign_badges !== false,
          show_trust_badge !== false,
          show_progress_indicators !== false,
          show_statistics !== false,
          show_hover_effects !== false
        ]

        db.query(query, [values], async (err, data) => {
        if (err) {
            // Clean up uploaded images if database insert fails (only if Azure is configured)
            if (imageService.getStatus().isAzureConfigured) {
              await Promise.all([
                imageService.deleteImage(bgImagePath),
                imageService.deleteImage(aboutImagePath),
                imageService.deleteImage(textImagePath),
                imageService.deleteImage(imageOnePath),
                imageService.deleteImage(imageTwoPath),
                imageService.deleteImage(imageThreePath)
              ]);
            }
          reject(new DatabaseError('Failed to create landing page', err));
          return;
        }

          // Move images from temp to actual landing page ID (only if Azure is configured)
          const landingPageId = data.insertId;
          if (imageService.getStatus().isAzureConfigured && bgImagePath) {
            try {
              await imageService.updateImage(organization_id, 'landing-pages', landingPageId, 'banner', req.files.bgImage[0], bgImagePath);
            } catch (error) {
              console.warn('Failed to move image from temp to final location:', error.message);
            }
          }

        sendCreated(res, { pageId: data.insertId }, 'Landing page created successfully');
      resolve();
      })
      } catch (error) {
        reject(new DatabaseError('Failed to process landing page creation', error));
      }
    })
  })
})

export const updateLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    about,
    mainHeadline,
    mainText,
    impactText,
    headlineOne,
    descriptionOne,
    headlineTwo,
    descriptionTwo,
    headlineThree,
    descriptionThree,
    // Color customization
    bg_color, 
    p_color, 
    s_color, 
    c_color, 
    ct_color, 
    b_color, 
    bt_color,
    // Font sizes
    hero_title_size,
    hero_subtitle_size,
    section_title_size,
    body_text_size,
    button_text_size,
    card_title_size,
    // Layout & spacing
    hero_height,
    section_padding,
    card_radius,
    button_radius,
    // Visual effects
    overlay_opacity,
    accent_color,
    // Element visibility toggles
    show_video_button,
    show_hero_icons,
    show_feature_icons,
    show_campaign_badges,
    show_trust_badge,
    show_progress_indicators,
    show_statistics,
    show_hover_effects
  } = req.body;
  
  if (!id) {
    throw new ValidationError('Landing page ID is required');
  }
  
  if (!title) {
    throw new ValidationError('Title is required');
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 },
      { name: "textImage", maxCount: 1 },
      { name: "imageOne", maxCount: 1 },
      { name: "imageTwo", maxCount: 1 },
      { name: "imageThree", maxCount: 1 }
    ])(req, res, async (err) => {
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          reject(new ValidationError('File is too large. Max size is 5MB'));
          return;
        }
        reject(new DatabaseError('Image upload failed', err));
        return;
      }

      try {
        // First, get current landing page to access existing image paths
        const getQuery = "SELECT * FROM landing_pages WHERE id = ?";
        
        db.query(getQuery, [id], async (err, data) => {
          if (err) {
            reject(new DatabaseError('Failed to fetch landing page', err));
            return;
          }
          
          if (!data || data.length === 0) {
            reject(new NotFoundError('Landing page'));
            return;
          }

          const currentPage = data[0];
          const organization_id = currentPage.organization_id;

          // Handle image updates
          let bgImagePath = currentPage.bgImage;
          let aboutImagePath = currentPage.aboutImage;
          let textImagePath = currentPage.textImage;
          let imageOnePath = currentPage.imageOne;
          let imageTwoPath = currentPage.imageTwo;
          let imageThreePath = currentPage.imageThree;

          // Update images if new ones are provided
          if (req.files?.bgImage?.[0]) {
            imageService.validateFile(req.files.bgImage[0]);
            bgImagePath = await imageService.updateImage(organization_id, 'landing-pages', id, 'banner', req.files.bgImage[0], currentPage.bgImage);
          }

          if (req.files?.aboutImage?.[0]) {
            imageService.validateFile(req.files.aboutImage[0]);
            aboutImagePath = await imageService.updateImage(organization_id, 'landing-pages', id, 'about', req.files.aboutImage[0], currentPage.aboutImage);
          }

          if (req.files?.textImage?.[0]) {
            imageService.validateFile(req.files.textImage[0]);
            textImagePath = await imageService.updateImage(organization_id, 'landing-pages', id, 'impact', req.files.textImage[0], currentPage.textImage);
          }

          if (req.files?.imageOne?.[0]) {
            imageService.validateFile(req.files.imageOne[0]);
            imageOnePath = await imageService.updateImage(organization_id, 'landing-pages', id, 'triple', req.files.imageOne[0], currentPage.imageOne);
          }

          if (req.files?.imageTwo?.[0]) {
            imageService.validateFile(req.files.imageTwo[0]);
            imageTwoPath = await imageService.updateImage(organization_id, 'landing-pages', id, 'triple', req.files.imageTwo[0], currentPage.imageTwo);
          }

          if (req.files?.imageThree?.[0]) {
            imageService.validateFile(req.files.imageThree[0]);
            imageThreePath = await imageService.updateImage(organization_id, 'landing-pages', id, 'triple', req.files.imageThree[0], currentPage.imageThree);
          }

          const query = `UPDATE landing_pages SET 
            title = ?, description = ?, bgImage = ?, aboutImage = ?, about = ?,
            mainHeadline = ?, mainText = ?, impactText = ?, textImage = ?,
            headlineOne = ?, descriptionOne = ?, imageOne = ?,
            headlineTwo = ?, descriptionTwo = ?, imageTwo = ?,
            headlineThree = ?, descriptionThree = ?, imageThree = ?,
            bg_color = ?, p_color = ?, s_color = ?, c_color = ?, ct_color = ?, b_color = ?, bt_color = ?,
            hero_title_size = ?, hero_subtitle_size = ?, section_title_size = ?, body_text_size = ?, button_text_size = ?, card_title_size = ?,
            hero_height = ?, section_padding = ?, card_radius = ?, button_radius = ?,
            overlay_opacity = ?, accent_color = ?,
            show_video_button = ?, show_hero_icons = ?, show_feature_icons = ?, show_campaign_badges = ?, show_trust_badge = ?, show_progress_indicators = ?, show_statistics = ?, show_hover_effects = ?
            WHERE id = ?`

      const values = [
        title,
        description,
            bgImagePath,
            aboutImagePath,
        about,
            mainHeadline,
            mainText,
            impactText,
            textImagePath,
            headlineOne,
            descriptionOne,
            imageOnePath,
            headlineTwo,
            descriptionTwo,
            imageTwoPath,
            headlineThree,
            descriptionThree,
            imageThreePath,
            bg_color,
        p_color,
        s_color,
        c_color,
        ct_color,
        b_color,
        bt_color,
            hero_title_size || '36px',
            hero_subtitle_size || '16px',
            section_title_size || '28px',
            body_text_size || '14px',
            button_text_size || '14px',
            card_title_size || '18px',
            hero_height || '500px',
            section_padding || '80px',
            card_radius || '4px',
            button_radius || '4px',
            overlay_opacity || 0.3,
            accent_color || '#1F2937',
            show_video_button !== false,
            show_hero_icons !== false,
            show_feature_icons !== false,
            show_campaign_badges !== false,
            show_trust_badge !== false,
            show_progress_indicators !== false,
            show_statistics !== false,
            show_hover_effects !== false,
        id
      ]

      db.query(query, values, (err, data) => {
        if (err) {
          reject(new DatabaseError('Failed to update landing page', err));
          return;
        }
        if (data.affectedRows === 0) {
          reject(new NotFoundError('Landing page'));
          return;
        }
        sendUpdated(res, data, 'Landing page updated successfully');
      resolve();
      })
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process landing page update', error));
      }
    })
  })
})

export const getLandingPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM landing_pages WHERE organization_id = ?"

  return new Promise(async (resolve, reject) => {
    db.query(query, [id], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch landing page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('Landing page'));
        return;
      }

      try {
        const landingPage = data[0];
        
        // Generate SAS URLs for all images (or return local paths in development)
        const imageUrls = await Promise.all([
          imageService.getImageUrl(landingPage.bgImage, 'public'),
          imageService.getImageUrl(landingPage.aboutImage, 'public'),
          imageService.getImageUrl(landingPage.textImage, 'public'),
          imageService.getImageUrl(landingPage.imageOne, 'public'),
          imageService.getImageUrl(landingPage.imageTwo, 'public'),
          imageService.getImageUrl(landingPage.imageThree, 'public')
        ]);

        // Replace image paths with URLs
        const result = {
          ...landingPage,
          bgImage: imageUrls[0],
          aboutImage: imageUrls[1],
          textImage: imageUrls[2],
          imageOne: imageUrls[3],
          imageTwo: imageUrls[4],
          imageThree: imageUrls[5]
        };

        sendSuccess(res, result, 'Landing page retrieved successfully');
      resolve();
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URLs', error));
      }
    })
  })
})