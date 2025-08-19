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

export const createSection = asyncHandler(async (req, res) => {
  const { organization_id, page_type, page_reference_id, name, active, user_id } = req.body;
  
  if (!organization_id || !page_type || !page_reference_id || !name || !user_id) {
    throw new ValidationError('Missing required fields: organization_id, page_type, page_reference_id, name, user_id');
  }

  const query = "INSERT INTO page_sections (`organization_id`, `page_type`, `page_reference_id`, `name`, `active`, `display_order`, `created_at`, `updated_at`, `updated_by`) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)"

  const values = [
    organization_id,
    page_type,
    page_reference_id,
    name, 
    active || true,
    0, // default display_order
    user_id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to create section', err));
      sendCreated(res, { sectionId: data.insertId }, 'Section created successfully');
      resolve();
    })
  })
})

export const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { active, display_order } = req.body;
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }

  const query = "UPDATE page_sections SET `active` = ?, `display_order` = ?, `updated_at` = NOW() WHERE `id` = ?"

  const values = [
    active,
    display_order || 0,
    id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update section', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Section'));
      sendUpdated(res, data, 'Section updated successfully');
      resolve();
    })
  })
})

export const getSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }

  const query = "SELECT * FROM page_sections WHERE id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch section', err));
      if (!data || data.length === 0) reject(new NotFoundError('Section'));
      sendSuccess(res, data[0], 'Section retrieved successfully');
      resolve();
    })
  })
})

export const getSectionsByPage = asyncHandler(async (req, res) => {
  const { organization_id, page_type, page_reference_id } = req.query;
  
  if (!organization_id || !page_type || !page_reference_id) {
    throw new ValidationError('Missing required parameters: organization_id, page_type, page_reference_id');
  }

  const query = "SELECT * FROM page_sections WHERE organization_id = ? AND page_type = ? AND page_reference_id = ? ORDER BY display_order ASC"

  return new Promise((resolve, reject) => {
    db.query(query, [organization_id, page_type, page_reference_id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch sections by page', err));
      sendSuccess(res, data, 'Sections retrieved successfully');
      resolve();
    })
  })
})

// Legacy endpoint for backward compatibility
export const getSectionByPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Page ID is required');
  }

  // This is a legacy endpoint - we need to determine the page type
  // For now, we'll assume it's a landing page and use organization_id = 1
  // In production, you'd want to look up the page type from the page tables
  const query = "SELECT * FROM page_sections WHERE page_reference_id = ? ORDER BY display_order ASC"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch sections by page', err));
      sendSuccess(res, data, 'Sections retrieved successfully');
      resolve();
    })
  })
})

export const updateSectionOrder = asyncHandler(async (req, res) => {
  const { organization_id, page_type, page_reference_id, sections } = req.body;
  
  if (!organization_id || !page_type || !page_reference_id || !sections) {
    throw new ValidationError('Missing required fields: organization_id, page_type, page_reference_id, sections');
  }

  // Update display_order for multiple sections
  const updatePromises = sections.map((section, index) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE page_sections SET `display_order` = ?, `updated_at` = NOW() WHERE `id` = ? AND `organization_id` = ? AND `page_type` = ? AND `page_reference_id` = ?"
      const values = [index, section.id, organization_id, page_type, page_reference_id]
      
      db.query(query, values, (err, data) => {
        if (err) reject(new DatabaseError('Failed to update section order', err));
        resolve();
      })
    })
  })

  try {
    await Promise.all(updatePromises);
    sendUpdated(res, {}, 'Section order updated successfully');
  } catch (error) {
    throw error;
  }
})