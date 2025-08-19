import { db } from "../db.js"
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

export const createUserOrganizationRelation = asyncHandler(async (req, res) => {
  const { userId, organizationId, status, role } = req.body;
  
  if (!userId || !organizationId || !status || !role) {
    throw new ValidationError('Missing required fields: userId, organizationId, status, role');
  }

  const query = "INSERT INTO user_organizations (`user_id`, `organization_id`, `status`, `role`, `created_at`) VALUES (?)"

  const values = [
    userId,
    organizationId,
    status,
    role,
    (new Date()).toISOString().slice(0, 19).replace('T', ' ')
  ]

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create user organization relation', err));
      sendCreated(res, { relationId: data.insertId }, 'User organization relation created successfully');
      resolve();
    })
  })
})

export const getUserOrganizations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  const query = `
    SELECT organizations.name, organizations.id AS organization_id, user_organizations.role, user_organizations.id
    FROM user_organizations
    JOIN organizations ON user_organizations.organization_id = organizations.id
    WHERE user_organizations.user_id = ?
  ` 

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      console.log("data ", data)
      if (err) reject(new DatabaseError('Failed to fetch user organizations', err));
      sendSuccess(res, data, 'User organizations retrieved successfully');
      resolve();
    })
  })
})

export const getPendingUserOrganizations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  const query = `
    SELECT organizations.name, organizations.id AS organization_id, user_organizations.role, user_organizations.id
    FROM user_organizations
    JOIN organizations ON user_organizations.organization_id = organizations.id
    WHERE status = "pending" AND user_organizations.user_id = ?
  ` 

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch pending user organizations', err));
      sendSuccess(res, data, 'Pending user organizations retrieved successfully');
      resolve();
    })
  })
})

export const updateUserOrganizationRelation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User organization relation ID is required');
  }

  const query = `
    UPDATE user_organizations 
    SET STATUS = "active" 
    WHERE id = ?
  ` 

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to update user organization relation', err));
      if (data.affectedRows === 0) reject(new NotFoundError('User organization relation'));
      sendUpdated(res, data, 'User organization relation updated successfully');
      resolve();
    })
  })
})