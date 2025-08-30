import { db } from "../db.js";
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
import multer from "multer"
import { checkAndUpdateOrganizationStatus } from "./organization_status.js"
import imageService from "../services/imageService.js"

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new ValidationError('Only image files are allowed'), false)
    }
  }
})

export const createHeaderPage = asyncHandler(async (req, res) => {
  upload.fields([
    { name: 'logo', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      throw new ValidationError(err.message)
    }

    const { organization_id, user_id } = req.body
    
    if (!organization_id || !user_id) {
      throw new ValidationError('Missing required fields: organization_id, user_id')
    }

    const query = "INSERT INTO header_pages (`organization_id`, `user_id`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())"

    return new Promise((resolve, reject) => {
      db.query(query, [organization_id, user_id], (err, data) => {
        if (err) reject(new DatabaseError('Failed to create header page', err))
        sendCreated(res, { pageId: data.insertId }, 'Header page created successfully')
        resolve()
      })
    })
  })
})

export const getHeaderPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required')
  }

  const query = "SELECT * FROM header_pages WHERE organization_id = ?"

  return new Promise(async (resolve, reject) => {
    db.query(query, [organizationId], async (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch header page', err))
      if (!data || data.length === 0) reject(new NotFoundError('Header page'))
      
      try {
        const headerPage = data[0];
        
        // Generate SAS URL for logo image (or return local path in development)
        const logoUrl = await imageService.getImageUrl(headerPage.logo, 'public');

        // Replace image path with URL
        const result = {
          ...headerPage,
          logo: logoUrl
        };

        sendSuccess(res, result, 'Header page retrieved successfully')
        resolve()
      } catch (error) {
        reject(new DatabaseError('Failed to generate image URL', error));
      }
    })
  })
})

export const updateHeaderPage = asyncHandler(async (req, res) => {
  const { id } = req.params
  
  upload.fields([
    { name: 'logo', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      throw new ValidationError(err.message)
    }

    const { 
      logo, 
      organizationName, 
      tagline, 
      description,
      bgColor,
      textColor,
      linkColor,
      fontSize,
      borderBottom,
      borderColor,
      shadow,
      active
    } = req.body

    if (!id) {
      throw new ValidationError('Header page ID is required')
    }

    let logoUrl = logo
    if (req.files && req.files.logo) {
      // Get organization_id from the header page first
      const getOrgQuery = "SELECT organization_id FROM header_pages WHERE id = ?";
      const orgResult = await new Promise((resolve, reject) => {
        db.query(getOrgQuery, [id], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      
      if (!orgResult || orgResult.length === 0) {
        throw new ValidationError('Header page not found');
      }
      
      const organizationId = orgResult[0].organization_id;
      
      // Validate and upload image using Azure blob storage
      imageService.validateFile(req.files.logo[0]);
      logoUrl = await imageService.uploadImage(organizationId, 'header-pages', id, 'logo', req.files.logo[0]);
    }

    const query = `
      UPDATE header_pages SET 
        logo = ?, 
        organization_name = ?, 
        tagline = ?, 
        description = ?,
        bg_color = ?,
        text_color = ?,
        font_size = ?,
        border_bottom = ?,
        border_color = ?,
        shadow = ?,
        active = ?,
        updated_at = NOW()
      WHERE id = ?
    `
 
    const values = [
      logoUrl,
      organizationName || "",
      tagline || "",
      description || "",
      bgColor || "#FFFFFF",
      textColor || "#000000",
      fontSize || "16px",
      borderBottom === 'true' || borderBottom === true ? 1 : 0,
      borderColor || "#E5E7EB",
      shadow === 'true' || shadow === true ? 1 : 0,
      active === 'true' || active === true ? 1 : 0,
      id
    ]

    console.log("header page values", values)

    return new Promise((resolve, reject) => {
      db.query(query, values, async (err, data) => {
        if (err) reject(new DatabaseError('Failed to update header page', err))
        if (data.affectedRows === 0) reject(new NotFoundError('Header page'))

        // Check and update organization status after header page update
        try {
          // Get organization_id from the header page
          const getOrgQuery = "SELECT organization_id FROM header_pages WHERE id = ?";
          db.query(getOrgQuery, [id], async (orgErr, orgData) => {
            if (!orgErr && orgData && orgData.length > 0) {
              const organizationId = orgData[0].organization_id;
              try {
                await checkAndUpdateOrganizationStatus(organizationId);
              } catch (statusError) {
                console.error('Failed to update organization status after header page update:', statusError);
                // Don't fail the main operation, just log the error
              }
            }
          });
        } catch (statusError) {
          console.error('Error checking organization status:', statusError);
          // Don't fail the main operation
        }

        sendUpdated(res, data, 'Header page updated successfully')
        resolve()
      })
    })
  })
})
