import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendConflict,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError
} from "../utils/errors.js"

export const register = asyncHandler(async (req, res) => {
  const { name, email, address, city, state, country, zip, userId } = req.body;
  
  if (!name || !email || !userId) {
    throw new ValidationError('Missing required fields: name, email, userId');
  }

  const q = "SELECT * FROM organizations WHERE email = ?"

  return new Promise((resolve, reject) => {
    db.query(q, [email], (err, data) => {
      if (err) reject(new DatabaseError('Failed to check existing organization', err));
      if (data.length > 0) reject(new ConflictError('Organization already exists'));
      
      const query = "INSERT INTO organizations(`name`, `email`, `address`, `city`, `state`, `country`, `zip`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (?)";
      const values = [
        name, 
        email, 
        address,
        city,
        state,
        country,
        zip,
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        userId,
        userId
      ]
  
      db.query(query, [values], (err, data) => {
        if (err) reject(new DatabaseError('Failed to create organization', err));
        sendCreated(res, { organizationId: data.insertId }, 'Organization created successfully');
      resolve();
      })
    })
  })
})

export const get = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM organizations WHERE id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch organization', err));
      if (!data || data.length === 0) reject(new NotFoundError('Organization'));
      sendSuccess(res, data[0], 'Organization retrieved successfully');
      resolve();
    })
  })
})

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, country, zip, updated_by } = req.body;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  if (!name || !updated_by) {
    throw new ValidationError('Missing required fields: name, updated_by');
  }

  const query = "UPDATE organizations SET `name` = ?, `address` = ?, `city` = ?, `state` = ?, `country` = ?, `zip` = ?, `updated_at` = ?, `updated_by` = ? WHERE id = ?"

  const values = [
    name, 
    address,
    city,
    state,
    country,
    zip,
    (new Date()).toISOString().slice(0, 19).replace('T', ' '),
    updated_by,
    id
  ]

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update organization', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Organization'));
      sendUpdated(res, data, 'Organization updated successfully');
      resolve();
    })
  })
})



