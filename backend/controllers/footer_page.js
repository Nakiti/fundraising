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

export const createFooterPage = asyncHandler(async (req, res) => {
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

    const query = "INSERT INTO footer_pages (`organization_id`, `user_id`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())"

    return new Promise((resolve, reject) => {
      db.query(query, [organization_id, user_id], (err, data) => {
        if (err) reject(new DatabaseError('Failed to create footer page', err))
        sendCreated(res, { pageId: data.insertId }, 'Footer page created successfully')
        resolve()
      })
    })
  })
})

export const getFooterPage = asyncHandler(async (req, res) => {
  const { organizationId } = req.params
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required')
  }

  const query = "SELECT * FROM footer_pages WHERE organization_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [organizationId], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch footer page', err))
      if (!data || data.length === 0) reject(new NotFoundError('Footer page'))
      sendSuccess(res, data[0], 'Footer page retrieved successfully')
      resolve()
    })
  })
})

export const updateFooterPage = asyncHandler(async (req, res) => {
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
      showTagline,
      description,
      showDescription,
      contactInfo,
      showContactInfo,
      links,
      showLinks,
      socialLinks,
      showSocialLinks,
      bgColor,
      textColor,
      linkColor,
      footerHeight,
      fontSize,
      borderTop,
      borderColor,
      shadow,
      footerLayout,
      contentAlignment,
      socialPosition,
      socialIconSize,
      socialIconColor,
      socialLayout,
      socialSpacing,
      active
    } = req.body

    if (!id) {
      throw new ValidationError('Footer page ID is required')
    }

    // Validate required fields for publishing
    // if (active === 'true' || active === true) {
    //   if (!logo || !organizationName) {
    //     throw new ValidationError('Missing required fields: logo, organizationName')
    //   }
    // }

    let logoUrl = logo
    if (req.files && req.files.logo) {
      // In a real implementation, you would upload the file to cloud storage
      // and get back a URL. For now, we'll use a placeholder
      logoUrl = `/uploads/footers/${Date.now()}_${req.files.logo[0].originalname}`
    }

    const query = `
      UPDATE footer_pages SET 
        logo = ?, 
        organization_name = ?, 
        tagline = ?, 
        show_tagline = ?,
        description = ?,
        show_description = ?,
        contact_info = ?,
        show_contact_info = ?,
        links = ?,
        show_links = ?,
        social_links = ?,
        show_social_links = ?,
        bg_color = ?,
        text_color = ?,
        link_color = ?,
        footer_height = ?,
        font_size = ?,
        border_top = ?,
        border_color = ?,
        shadow = ?,
        footer_layout = ?,
        content_alignment = ?,
        social_position = ?,
        social_icon_size = ?,
        social_icon_color = ?,
        social_layout = ?,
        social_spacing = ?,
        active = ?,
        updated_at = NOW()
      WHERE id = ?
    `

    const values = [
      logoUrl,
      organizationName || "",
      tagline || "",
      showTagline === 'true' || showTagline === true ? 1 : 0,
      description || "",
      showDescription === 'true' || showDescription === true ? 1 : 0,
      contactInfo || "",
      showContactInfo === 'true' || showContactInfo === true ? 1 : 0,
      links ? JSON.stringify(links) : "[]",
      showLinks === 'true' || showLinks === true ? 1 : 0,
      socialLinks ? JSON.stringify(socialLinks) : "[]",
      showSocialLinks === 'true' || showSocialLinks === true ? 1 : 0,
      bgColor || "#1F2937",
      textColor || "#FFFFFF",
      linkColor || "#60A5FA",
      footerHeight || "auto",
      fontSize || "14px",
      borderTop === 'true' || borderTop === true ? 1 : 0,
      borderColor || "#374151",
      shadow === 'true' || shadow === true ? 1 : 0,
      footerLayout || "three-column",
      contentAlignment || "left",
      socialPosition || "bottom",
      socialIconSize || "medium",
      socialIconColor || "#FFFFFF",
      socialLayout || "horizontal",
      socialSpacing || "normal",
      active === 'true' || active === true ? 1 : 0,
      id
    ]

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, data) => {
        if (err) reject(new DatabaseError('Failed to update footer page', err))
        if (data.affectedRows === 0) reject(new NotFoundError('Footer page'))
        sendUpdated(res, data, 'Footer page updated successfully')
        resolve()
      })
    })
  })
})
