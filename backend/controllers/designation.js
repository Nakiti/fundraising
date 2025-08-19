import { db } from "../db.js"
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

export const createDesignation = asyncHandler(async (req, res) => {
  const { organization_id, title, goal, created_by, updated_by } = req.body;
  
  if (!organization_id || !title || !created_by || !updated_by) {
    throw new ValidationError('Missing required fields: organization_id, title, created_by, updated_by');
  }

  const q = "SELECT * FROM designations WHERE title = ?"

  return new Promise((resolve, reject) => {
    db.query(q, [title], (err, data) => {
      if (err) reject(new DatabaseError('Failed to check existing designation', err));
      if (data.length > 0) reject(new ConflictError('Designation already exists'));

      const query = "INSERT INTO designations (`organization_id`, `title`, `raised`, `goal`, `donations`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES (?)"

      const values = [
        organization_id,
        title,
        0,
        goal || 0,
        0,
        "active",
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        (new Date()).toISOString().slice(0, 19).replace('T', ' '),
        created_by,
        updated_by
      ]
   
      db.query(query, [values], (err, data) => {
        if (err) reject(new DatabaseError('Failed to create designation', err));
        sendCreated(res, { designationId: data.insertId }, 'Designation created successfully');
      resolve();
      })
    })
  })
})

export const updateDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, goal, status, updated_by } = req.body;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }
  
  if (!title || !updated_by) {
    throw new ValidationError('Missing required fields: title, updated_by');
  }

  if (status === "inactive") {
    const query = "SELECT * FROM campaign_designations WHERE designation_id = ?";

    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, data) => {
        if (err) reject(new DatabaseError('Failed to check designation usage', err));        
        if (data.length > 0) reject(new ConflictError('Designation currently in use'));
        
        updateDesignationDetails(req, res).then(resolve).catch(reject);
      });
    });
  } else {
    return updateDesignationDetails(req, res);
  }
});

const updateDesignationDetails = async (req, res) => {
  const { id } = req.params;
  const { title, goal, status } = req.body;

  const query = "UPDATE designations SET `title` = ?, `goal` = ?, `status` = ? WHERE id = ?";

  const values = [
    title,
    goal,
    status,
    id
  ];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update designation', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Designation'));
      sendUpdated(res, data, 'Designation updated successfully');
      resolve();
    });
  });
};

export const getDesignations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM designations WHERE organization_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch designations', err));
      sendSuccess(res, data, 'Designations retrieved successfully');
      resolve();
    })
  })
})

export const getActiveDesignations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  const query = "SELECT * FROM designations WHERE status = 'active' AND organization_id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch active designations', err));
      sendSuccess(res, data, 'Active designations retrieved successfully');
      resolve();
    })
  })
})

export const getDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }

  const query = "SELECT * FROM designations WHERE id = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch designation', err));
      if (!data || data.length === 0) reject(new NotFoundError('Designation'));
      sendSuccess(res, data[0], 'Designation retrieved successfully');
      resolve();
    })
  })
})

export const deleteDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Designation ID is required');
  }

  // Check if designation is in use
  const checkQuery = "SELECT * FROM campaign_designations WHERE designation_id = ?";

  return new Promise((resolve, reject) => {
    db.query(checkQuery, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to check designation usage', err));
      if (data.length > 0) reject(new ConflictError('Cannot delete designation that is currently in use'));

      const deleteQuery = "DELETE FROM designations WHERE id = ?";
      db.query(deleteQuery, [id], (err, data) => {
        if (err) reject(new DatabaseError('Failed to delete designation', err));
        if (data.affectedRows === 0) reject(new NotFoundError('Designation'));
        sendSuccess(res, null, 'Designation deleted successfully');
      resolve();
      });
    });
  });
})