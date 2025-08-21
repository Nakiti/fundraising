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

  return new Promise((resolve, reject) => {
    db.query(query, [organizationId], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch header page', err))
      if (!data || data.length === 0) reject(new NotFoundError('Header page'))
      sendSuccess(res, data[0], 'Header page retrieved successfully')
      resolve()
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
      showTagline,
      showNavigation,
      navigationItems,
      showSearch,
      showLoginButton,
      showDonateButton,
      bgColor,
      textColor,
      accentColor,
      headerHeight,
      logoSize,
      fontSize,
      fontWeight,
      borderBottom,
      borderColor,
      shadow,
      logoPosition,
      navigationPosition,
      buttonPosition,
      active
    } = req.body

    if (!id) {
      throw new ValidationError('Header page ID is required')
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
      logoUrl = `/uploads/headers/${Date.now()}_${req.files.logo[0].originalname}`
    }

    const query = `
      UPDATE header_pages SET 
        logo = ?, 
        organization_name = ?, 
        tagline = ?, 
        show_tagline = ?,
        show_navigation = ?,
        navigation_items = ?,
        show_search = ?,
        show_login_button = ?,
        show_donate_button = ?,
        bg_color = ?,
        text_color = ?,
        accent_color = ?,
        header_height = ?,
        logo_size = ?,
        font_size = ?,
        font_weight = ?,
        border_bottom = ?,
        border_color = ?,
        shadow = ?,
        logo_position = ?,
        navigation_position = ?,
        button_position = ?,
        active = ?,
        updated_at = NOW()
      WHERE id = ?
    `

    const values = [
      logoUrl,
      organizationName || "",
      tagline || "",
      showTagline === 'true' || showTagline === true ? 1 : 0,
      showNavigation === 'true' || showNavigation === true ? 1 : 0,
      navigationItems ? JSON.stringify(navigationItems) : "[]",
      showSearch === 'true' || showSearch === true ? 1 : 0,
      showLoginButton === 'true' || showLoginButton === true ? 1 : 0,
      showDonateButton === 'true' || showDonateButton === true ? 1 : 0,
      bgColor || "#FFFFFF",
      textColor || "#000000",
      accentColor || "#3B82F6",
      headerHeight || "80px",
      logoSize || "40px",
      fontSize || "16px",
      fontWeight || "500",
      borderBottom === 'true' || borderBottom === true ? 1 : 0,
      borderColor || "#E5E7EB",
      shadow === 'true' || shadow === true ? 1 : 0,
      logoPosition || "left",
      navigationPosition || "center",
      buttonPosition || "right",
      active === 'true' || active === true ? 1 : 0,
      id
    ]

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, data) => {
        if (err) reject(new DatabaseError('Failed to update header page', err))
        if (data.affectedRows === 0) reject(new NotFoundError('Header page'))
        sendUpdated(res, data, 'Header page updated successfully')
        resolve()
      })
    })
  })
})
