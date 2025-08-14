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
  const { page_id, name, active, user_id } = req.body;
  
  if (!page_id || !name || !user_id) {
    throw new ValidationError('Missing required fields: page_id, name, user_id');
  }

  const query = "INSERT INTO sections (`page_id`, `name`, `active`, `updated_at`, `updated_by`) VALUES (?)"

  const values = [
    page_id,
    name, 
    active || false,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    user_id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create section', err));
      resolve(sendCreated(res, { sectionId: data.insertId }, 'Section created successfully'));
    })
  })
})

export const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }

  const query = "UPDATE sections SET `active` = ? WHERE `id` = ?"

  const values = [
    active,
    id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update section', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Section'));
      resolve(sendUpdated(res, data, 'Section updated successfully'));
    })
  })
})

export const getSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Section ID is required');
  }

  const query = "SELECT * FROM sections WHERE id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch section', err));
      if (!data || data.length === 0) reject(new NotFoundError('Section'));
      resolve(sendSuccess(res, data[0], 'Section retrieved successfully'));
    })
  })
})

export const getSectionByPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Page ID is required');
  }

  const query = "SELECT * FROM sections WHERE page_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch sections by page', err));
      resolve(sendSuccess(res, data, 'Sections retrieved successfully'));
    })
  })
})