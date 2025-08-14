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

export const createCustomQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questions = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new ValidationError('Questions array is required and must not be empty');
  }

  const query = "INSERT INTO campaign_questions (`campaign_id`, `question`, `type`, `created_at`) VALUES ?"
  
  const values = questions.map(question => [
    Number(id),
    question.question,
    question.type,
    (new Date()).toISOString().slice(0, 19).replace('T', ' ')
  ])
  
  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create custom questions', err));
      resolve(sendCreated(res, { insertedCount: data.affectedRows }, 'Custom questions created successfully'));
    })
  })
})

export const deleteCustomQuestion = asyncHandler(async (req, res) => {
  const { campaign_id } = req.params;
  
  if (!campaign_id) {
    throw new ValidationError('Question ID is required');
  }

  const query = "DELETE FROM campaign_questions WHERE `question_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [campaign_id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete custom question', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Custom question'));
      resolve(sendDeleted(res, 'Custom question deleted successfully'));
    })
  })
})

export const deleteCustomQuestionsBatch = asyncHandler(async (req, res) => {
  const items = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required and must not be empty');
  }

  const query = "DELETE FROM campaign_questions WHERE `id` IN (?)"

  const values = items.map(item => item.id)

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete custom questions batch', err));
      resolve(sendDeleted(res, `Deleted ${data.affectedRows} custom questions successfully`));
    })
  })
})

export const getCustomQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM campaign_questions WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch custom questions', err));
      resolve(sendSuccess(res, data, 'Custom questions retrieved successfully'));
    })
  })
})