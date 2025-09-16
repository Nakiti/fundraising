import { asyncHandler } from "../middleware/errorHandler.js";
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendNotFound
} from "../utils/response.js";
import { ValidationError } from "../utils/errors.js";
import { getCustomQuestionResponseService } from "../services/ServiceRegistry.js";

// Initialize service
const customQuestionResponseService = getCustomQuestionResponseService();

/**
 * Create a single custom question response
 */
export const createResponse = asyncHandler(async (req, res) => {
  const response = await customQuestionResponseService.createResponse(req.body);
  sendCreated(res, response, 'Custom question response created successfully');
});

/**
 * Create multiple custom question responses (batch operation)
 */
export const createResponsesBatch = asyncHandler(async (req, res) => {
  const { responses } = req.body;
  
  if (!responses || !Array.isArray(responses)) {
    throw new ValidationError('Responses array is required');
  }

  const result = await customQuestionResponseService.createResponsesBatch(responses);
  sendCreated(res, result, `${result.createdCount} custom question responses created successfully`);
});

/**
 * Get responses by transaction ID
 */
export const getResponsesByTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  
  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  const responses = await customQuestionResponseService.getResponsesByTransaction(parseInt(transactionId));
  sendSuccess(res, responses, 'Responses retrieved successfully');
});

/**
 * Get responses by question ID
 */
export const getResponsesByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { limit = 100, offset = 0 } = req.query;
  
  if (!questionId) {
    throw new ValidationError('Question ID is required');
  }

  const responses = await customQuestionResponseService.getResponsesByQuestion(
    parseInt(questionId), 
    { limit: parseInt(limit), offset: parseInt(offset) }
  );
  sendSuccess(res, responses, 'Responses retrieved successfully');
});

/**
 * Get responses by donor ID
 */
export const getResponsesByDonor = asyncHandler(async (req, res) => {
  const { donorId } = req.params;
  const { limit = 100, offset = 0 } = req.query;
  
  if (!donorId) {
    throw new ValidationError('Donor ID is required');
  }

  const responses = await customQuestionResponseService.getResponsesByDonor(
    parseInt(donorId), 
    { limit: parseInt(limit), offset: parseInt(offset) }
  );
  sendSuccess(res, responses, 'Responses retrieved successfully');
});

/**
 * Get responses by campaign ID
 */
export const getResponsesByCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const { limit = 100, offset = 0 } = req.query;
  
  if (!campaignId) {
    throw new ValidationError('Campaign ID is required');
  }

  const responses = await customQuestionResponseService.getResponsesByCampaign(
    parseInt(campaignId), 
    { limit: parseInt(limit), offset: parseInt(offset) }
  );
  sendSuccess(res, responses, 'Responses retrieved successfully');
});

/**
 * Get response statistics for a campaign
 */
export const getResponseStatistics = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  
  if (!campaignId) {
    throw new ValidationError('Campaign ID is required');
  }

  const statistics = await customQuestionResponseService.getResponseStatistics(parseInt(campaignId));
  sendSuccess(res, statistics, 'Response statistics retrieved successfully');
});

/**
 * Update a custom question response
 */
export const updateResponse = asyncHandler(async (req, res) => {
  const { responseId } = req.params;
  
  if (!responseId) {
    throw new ValidationError('Response ID is required');
  }

  const updatedResponse = await customQuestionResponseService.updateResponse(
    parseInt(responseId), 
    req.body
  );
  sendUpdated(res, updatedResponse, 'Response updated successfully');
});

/**
 * Delete a custom question response
 */
export const deleteResponse = asyncHandler(async (req, res) => {
  const { responseId } = req.params;
  
  if (!responseId) {
    throw new ValidationError('Response ID is required');
  }

  const result = await customQuestionResponseService.deleteResponse(parseInt(responseId));
  sendDeleted(res, result.message);
});

/**
 * Delete all responses for a transaction
 */
export const deleteResponsesByTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  
  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  const result = await customQuestionResponseService.deleteResponsesByTransaction(parseInt(transactionId));
  sendDeleted(res, result.message);
});

/**
 * Get a single response by ID
 */
export const getResponse = asyncHandler(async (req, res) => {
  const { responseId } = req.params;
  
  if (!responseId) {
    throw new ValidationError('Response ID is required');
  }

  const response = await customQuestionResponseService.getById(parseInt(responseId));
  if (!response) {
    sendNotFound(res, 'Custom question response');
    return;
  }

  sendSuccess(res, response, 'Response retrieved successfully');
});



