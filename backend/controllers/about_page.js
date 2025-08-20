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

export const createAboutPage = asyncHandler(async (req, res) => {
  // Validation will be done after multer processes the FormData

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 },
      { name: "teamImage", maxCount: 1 },
      { name: "missionImage", maxCount: 1 },
      { name: "visionImage", maxCount: 1 },
      { name: "valuesImage", maxCount: 1 }
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
        // Now that multer has processed the FormData, we can access req.body
        const { 
          organization_id, 
          title, 
          description, 
          headline,
          aboutText,
          whatText,
          whyText,
          teamText,
          missionText,
          visionText,
          valuesText,
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
          show_team_photos,
          show_mission_section,
          show_vision_section,
          show_values_section,
          show_hover_effects
        } = req.body;
        
        if (!organization_id || !title) {
          reject(new ValidationError('Missing required fields: organization_id, title'));
          return;
        }

        // Handle image uploads
        let bgImagePath = null;
        let aboutImagePath = null;
        let teamImagePath = null;
        let missionImagePath = null;
        let visionImagePath = null;
        let valuesImagePath = null;

        // Upload images if provided
        if (req.files?.bgImage?.[0]) {
          imageService.validateFile(req.files.bgImage[0]);
          bgImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'hero', req.files.bgImage[0]);
        }

        if (req.files?.aboutImage?.[0]) {
          imageService.validateFile(req.files.aboutImage[0]);
          aboutImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'about', req.files.aboutImage[0]);
        }

        if (req.files?.teamImage?.[0]) {
          imageService.validateFile(req.files.teamImage[0]);
          teamImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'team', req.files.teamImage[0]);
        }

        if (req.files?.missionImage?.[0]) {
          imageService.validateFile(req.files.missionImage[0]);
          missionImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'mission', req.files.missionImage[0]);
        }

        if (req.files?.visionImage?.[0]) {
          imageService.validateFile(req.files.visionImage[0]);
          visionImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'vision', req.files.visionImage[0]);
        }

        if (req.files?.valuesImage?.[0]) {
          imageService.validateFile(req.files.valuesImage[0]);
          valuesImagePath = await imageService.uploadImage(organization_id, 'about-pages', 'temp', 'values', req.files.valuesImage[0]);
        }

        const query = `INSERT INTO about_pages (
          organization_id, title, description, headline, aboutText, whatText, whyText, teamText,
          missionText, visionText, valuesText,
          bgImage, aboutImage, teamImage, missionImage, visionImage, valuesImage,
          bg_color, p_color, s_color, c_color, ct_color, b_color, bt_color,
          hero_title_size, hero_subtitle_size, section_title_size, body_text_size, button_text_size, card_title_size,
          hero_height, section_padding, card_radius, button_radius,
          overlay_opacity, accent_color,
          show_video_button, show_hero_icons, show_feature_icons, show_team_photos, show_mission_section, show_vision_section, show_values_section, show_hover_effects
        ) VALUES (?)`

        const values = [
          organization_id,
          title,
          description,
          headline,
          aboutText,
          whatText,
          whyText,
          teamText,
          missionText,
          visionText,
          valuesText,
          bgImagePath,
          aboutImagePath,
          teamImagePath,
          missionImagePath,
          visionImagePath,
          valuesImagePath,
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
          show_team_photos !== false,
          show_mission_section !== false,
          show_vision_section !== false,
          show_values_section !== false,
          show_hover_effects !== false
        ]

        db.query(query, [values], async (err, data) => {
          if (err) {
            // Clean up uploaded images if database insert fails (only if Azure is configured)
            if (imageService.getStatus().isAzureConfigured) {
              await Promise.all([
                imageService.deleteImage(bgImagePath),
                imageService.deleteImage(aboutImagePath),
                imageService.deleteImage(teamImagePath),
                imageService.deleteImage(missionImagePath),
                imageService.deleteImage(visionImagePath),
                imageService.deleteImage(valuesImagePath)
              ]);
            }
            reject(new DatabaseError('Failed to create about page', err));
            return;
          }

          // Move images from temp to actual about page ID (only if Azure is configured)
          const aboutPageId = data.insertId;
          if (imageService.getStatus().isAzureConfigured && bgImagePath) {
            try {
              await imageService.updateImage(organization_id, 'about-pages', aboutPageId, 'hero', req.files.bgImage[0], bgImagePath);
            } catch (error) {
              console.warn('Failed to move image from temp to final location:', error.message);
            }
          }

          sendCreated(res, { pageId: data.insertId }, 'About page created successfully');
      resolve();
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process about page creation', error));
      }
    })
  })
})

export const updateAboutPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    headline,
    aboutText,
    whatText,
    whyText,
    teamText,
    missionText,
    visionText,
    valuesText,
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
    show_team_photos,
    show_mission_section,
    show_vision_section,
    show_values_section,
    show_hover_effects,
    // Status
    active
  } = req.body;
  
  if (!id) {
    throw new ValidationError('About page ID is required');
  }
  
  // Only validate required fields when publishing (active = true)
  if (active === true || active === 'true') {
    if (!title) {
      throw new ValidationError('Title is required to publish the page');
    }
    if (!headline) {
      throw new ValidationError('Headline is required to publish the page');
    }
  }

  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "bgImage", maxCount: 1 },
      { name: "aboutImage", maxCount: 1 },
      { name: "teamImage", maxCount: 1 },
      { name: "missionImage", maxCount: 1 },
      { name: "visionImage", maxCount: 1 },
      { name: "valuesImage", maxCount: 1 }
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
        // First, get current about page to access existing image paths
        const getQuery = "SELECT * FROM about_pages WHERE id = ?";
        
        db.query(getQuery, [id], async (err, data) => {
          if (err) {
            reject(new DatabaseError('Failed to fetch about page', err));
            return;
          }
          
          if (!data || data.length === 0) {
            reject(new NotFoundError('About page'));
            return;
          }

          const currentPage = data[0];
          const organization_id = currentPage.organization_id;

          // Handle image updates
          let bgImagePath = currentPage.bgImage;
          let aboutImagePath = currentPage.aboutImage;
          let teamImagePath = currentPage.teamImage;
          let missionImagePath = currentPage.missionImage;
          let visionImagePath = currentPage.visionImage;
          let valuesImagePath = currentPage.valuesImage;

          // Update images if new ones are provided
          if (req.files?.bgImage?.[0]) {
            imageService.validateFile(req.files.bgImage[0]);
            bgImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'hero', req.files.bgImage[0], currentPage.bgImage);
          }

          if (req.files?.aboutImage?.[0]) {
            imageService.validateFile(req.files.aboutImage[0]);
            aboutImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'about', req.files.aboutImage[0], currentPage.aboutImage);
          }

          if (req.files?.teamImage?.[0]) {
            imageService.validateFile(req.files.teamImage[0]);
            teamImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'team', req.files.teamImage[0], currentPage.teamImage);
          }

          if (req.files?.missionImage?.[0]) {
            imageService.validateFile(req.files.missionImage[0]);
            missionImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'mission', req.files.missionImage[0], currentPage.missionImage);
          }

          if (req.files?.visionImage?.[0]) {
            imageService.validateFile(req.files.visionImage[0]);
            visionImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'vision', req.files.visionImage[0], currentPage.visionImage);
          }

          if (req.files?.valuesImage?.[0]) {
            imageService.validateFile(req.files.valuesImage[0]);
            valuesImagePath = await imageService.updateImage(organization_id, 'about-pages', id, 'values', req.files.valuesImage[0], currentPage.valuesImage);
          }

          const query = `UPDATE about_pages SET 
            title = ?, description = ?, headline = ?, aboutText = ?, whatText = ?, whyText = ?, teamText = ?,
            missionText = ?, visionText = ?, valuesText = ?,
            bgImage = ?, aboutImage = ?, teamImage = ?, missionImage = ?, visionImage = ?, valuesImage = ?,
            bg_color = ?, p_color = ?, s_color = ?, c_color = ?, ct_color = ?, b_color = ?, bt_color = ?,
            hero_title_size = ?, hero_subtitle_size = ?, section_title_size = ?, body_text_size = ?, button_text_size = ?, card_title_size = ?,
            hero_height = ?, section_padding = ?, card_radius = ?, button_radius = ?,
            overlay_opacity = ?, accent_color = ?,
            show_video_button = ?, show_hero_icons = ?, show_feature_icons = ?, show_team_photos = ?, show_mission_section = ?, show_vision_section = ?, show_values_section = ?, show_hover_effects = ?,
            active = ?
            WHERE id = ?`

          const values = [
            title,
            description,
            headline,
            aboutText,
            whatText,
            whyText,
            teamText,
            missionText,
            visionText,
            valuesText,
            bgImagePath,
            aboutImagePath,
            teamImagePath,
            missionImagePath,
            visionImagePath,
            valuesImagePath,
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
            show_team_photos !== false,
            show_mission_section !== false,
            show_vision_section !== false,
            show_values_section !== false,
            show_hover_effects !== false,
            active === true || active === 'true',
            id
          ]

          db.query(query, values, (err, data) => {
            if (err) {
              reject(new DatabaseError('Failed to update about page', err));
              return;
            }
            if (data.affectedRows === 0) {
              reject(new NotFoundError('About page'));
              return;
            }
            sendUpdated(res, data, 'About page updated successfully');
      resolve();
          })
        })
      } catch (error) {
        reject(new DatabaseError('Failed to process about page update', error));
      }
    })
  })
})

export const getAboutPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM about_pages WHERE organization_id = ?"

  return new Promise(async (resolve, reject) => {
    db.query(query, [id], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch about page', err));
        return;
      }
      if (!data || data.length === 0) {
        reject(new NotFoundError('About page'));
        return;
      }

      try {
        const aboutPage = data[0];
        
        // Generate SAS URLs for all images (or return local paths in development)
        const imageUrls = await Promise.all([
          imageService.getImageUrl(aboutPage.bgImage, 'public'),
          imageService.getImageUrl(aboutPage.aboutImage, 'public'),
          imageService.getImageUrl(aboutPage.teamImage, 'public'),
          imageService.getImageUrl(aboutPage.missionImage, 'public'),
          imageService.getImageUrl(aboutPage.visionImage, 'public'),
          imageService.getImageUrl(aboutPage.valuesImage, 'public')
        ]);

        // Replace image paths with URLs
        const result = {
          ...aboutPage,
          bgImage: imageUrls[0],
          aboutImage: imageUrls[1],
          teamImage: imageUrls[2],
          missionImage: imageUrls[3],
          visionImage: imageUrls[4],
          valuesImage: imageUrls[5]
        };

        sendSuccess(res, result, 'About page retrieved successfully');
      resolve();
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URLs', error));
      }
    })
  })
})
