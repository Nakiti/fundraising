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
      description,
      // Contact section fields
      address,
      phone,
      email,
      businessHours,
      contactFormUrl,
      // Social section fields
      socialLinks,
      // Basic styling
      bgColor,
      textColor,
      fontSize,
      borderTop,
      borderColor,
      shadow,
      active
    } = req.body

    if (!id) {
      throw new ValidationError('Footer page ID is required')
    }

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
        description = ?,
        address = ?,
        phone = ?,
        email = ?,
        business_hours = ?,
        contact_form_url = ?,
        social_links = ?,
        bg_color = ?,
        text_color = ?,
        font_size = ?,
        border_top = ?,
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
      address || "",
      phone || "",
      email || "",
      businessHours || "",
      contactFormUrl || "",
      socialLinks ? JSON.stringify(socialLinks) : "[]",
      bgColor || "#1F2937",
      textColor || "#FFFFFF",
      fontSize || "14px",
      borderTop === 'true' || borderTop === true ? 1 : 0,
      borderColor || "#374151",
      shadow === 'true' || shadow === true ? 1 : 0,
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
