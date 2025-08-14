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

export const createFaqs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faqs = req.body;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    throw new ValidationError('FAQs array is required and must not be empty');
  }

  const query = "INSERT INTO campaign_faqs (`campaign_id`, `question`, `answer`, `created_at`) VALUES ?"

  const values = faqs.map(faq => [
    Number(id),
    faq.question,
    faq.answer,
    (new Date()).toISOString().slice(0, 19).replace('T', ' ')
  ])

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create FAQs', err));
      resolve(sendCreated(res, { insertedCount: data.affectedRows }, 'FAQs created successfully'));
    })
  })
})

export const getFaqs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }

  const query = "SELECT * FROM campaign_faqs WHERE `campaign_id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch FAQs', err));
      resolve(sendSuccess(res, data, 'FAQs retrieved successfully'));
    })
  })
})

export const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('FAQ ID is required');
  }

  const query = "DELETE FROM campaign_faqs WHERE `id` = ?"

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete FAQ', err));
      if (data.affectedRows === 0) reject(new NotFoundError('FAQ'));
      resolve(sendDeleted(res, 'FAQ deleted successfully'));
    })
  })
})

export const deleteFaqsBatch = asyncHandler(async (req, res) => {
  const items = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required and must not be empty');
  }

  const query = "DELETE FROM campaign_faqs WHERE `id` IN (?)"

  const values = items.map(item => item.id)

  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, data) => {
      if (err) reject(new DatabaseError('Failed to delete FAQs batch', err));
      resolve(sendDeleted(res, `Deleted ${data.affectedRows} FAQs successfully`));
    })
  })
})