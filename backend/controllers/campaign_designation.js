import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

export const createRelationBatch = asyncHandler(async (req, res) => {
  const { campaign_id } = req.params;
  const relations = req.body;
  
  if (!campaign_id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!relations || !Array.isArray(relations) || relations.length === 0) {
    throw new ValidationError('Relations array is required and must not be empty');
  }

  const query = "INSERT INTO campaign_designations (`campaign_id`, `designation_id`, `created_at`) VALUES ?"

  const values = relations.map(relation => [
    Number(campaign_id),
    relation.id,
    (new Date()).toISOString().slice(0, 19).replace('T', ' ')
  ]);

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create campaign designation relations', err));
      resolve(sendCreated(res, { insertedCount: data.affectedRows }, 'Campaign designation relations created successfully'));
    })
  })
})

export const getRelations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = `
    SELECT designations.*
    FROM campaign_designations
    JOIN designations ON campaign_designations.designation_id = designations.id
    WHERE campaign_designations.campaign_id = ?
  `

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch campaign designation relations', err));
      resolve(sendSuccess(res, data, 'Campaign designation relations retrieved successfully'));
    })
  })
})

export const deleteRelation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Relation ID is required');
  }

  const query = "DELETE FROM campaign_designations WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete campaign designation relation', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Campaign designation relation'));
      resolve(sendDeleted(res, 'Campaign designation relation deleted successfully'));
    })
  })
})

export const deleteRelationBatch = asyncHandler(async (req, res) => {
  const items = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required and must not be empty');
  }

  const query = "DELETE FROM campaign_designations WHERE `designation_id` IN (?)"
  const values = items.map(item => item.id)

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete campaign designation relations batch', err));
      resolve(sendDeleted(res, `Deleted ${data.affectedRows} campaign designation relations successfully`));
    })
  })
})