import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js"
import { ValidationError } from "../utils/errors.js"
import { getTransactionService } from "../services/ServiceRegistry.js"

// Initialize service
const transactionService = getTransactionService()

export const createTransaction = asyncHandler(async (req, res) => {
  // Delegate to TransactionService
  const transaction = await transactionService.createTransaction(req.body);
  
  sendCreated(res, { 
    transactionId: transaction.id,
    stripePaymentIntentId: transaction.stripe_payment_intent_id 
  }, 'Transaction created successfully');
})

export const createTransactionWithResponses = asyncHandler(async (req, res) => {
  const { questionResponses, ...transactionData } = req.body;
  
  // Delegate to TransactionService
  const transaction = await transactionService.createTransactionWithResponses(
    transactionData, 
    questionResponses
  );
  
  sendCreated(res, { 
    transactionId: transaction.id,
    stripePaymentIntentId: transaction.stripe_payment_intent_id,
    questionResponses: transaction.question_responses,
    responseError: transaction.response_error
  }, 'Transaction with question responses created successfully');
})

export const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Transaction ID is required');
  }
  
  try {
    // Delegate to TransactionService
    const transaction = await transactionService.getTransaction(id);
    
    sendSuccess(res, transaction, 'Transaction retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Transaction not found');
    } else {
      throw error;
    }
  }
})

export const getTransactionForThankYou = asyncHandler(async (req, res) => {
  const { transactionId, campaignId } = req.query;
  
  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }
  
  if (!campaignId) {
    throw new ValidationError('Campaign ID is required');
  }
  
  try {
    // Delegate to TransactionService
    const transaction = await transactionService.getTransactionForThankYou(transactionId, campaignId);
    
    sendSuccess(res, transaction, 'Transaction retrieved successfully for thank you page');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Transaction not found or does not belong to this campaign');
    } else {
      throw error;
    }
  }
})

export const getTransactionsbyCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isAdmin = false } = req.query;
  
  if (!id) {
    throw new ValidationError('Campaign ID is required');
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.getTransactionsByCampaign(
    id, 
    isAdmin === 'true'
  );
  
  sendSuccess(res, transactions, 'Campaign transactions retrieved successfully');
})

export const getAllTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isAdmin = false } = req.query;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.getAllTransactions(
    id, 
    isAdmin === 'true'
  );
  
  sendSuccess(res, transactions, 'Organization transactions retrieved successfully');
})

export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Transaction ID is required');
  }
  
  try {
    // Delegate to TransactionService
    const transaction = await transactionService.updateTransaction(id, req.body);
    
    sendUpdated(res, transaction, 'Transaction updated successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Transaction not found');
    } else {
      throw error;
    }
  }
})

export const getTransactionsOverTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { period = 'day', limit = 30 } = req.query;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to TransactionService
  const analyticsData = await transactionService.getTransactionsOverTime(
    id, 
    period, 
    parseInt(limit)
  );
  
  sendSuccess(res, analyticsData, 'Transactions over time retrieved successfully');
})

export const searchTransactions = asyncHandler(async (req, res) => {
  const { q, isAdmin = false } = req.query;
  const { id } = req.params;
  
  if (!q) {
    throw new ValidationError('Search query is required');
  }
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.searchTransactions(
    id, 
    q, 
    isAdmin === 'true'
  );
  
  sendSuccess(res, transactions, 'Transaction search completed');
})

export const getFiltered = asyncHandler(async (req, res) => {
  const { status, isAdmin = false } = req.query;
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.getFilteredTransactions(
    id, 
    status, 
    isAdmin === 'true'
  );
  
  sendSuccess(res, transactions, 'Filtered transactions retrieved successfully');
})

export const getTransactionsByCampaignInOrg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { campaignIds, isAdmin = false } = req.query;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Parse campaign IDs if provided
  let parsedCampaignIds = null;
  if (campaignIds) {
    try {
      parsedCampaignIds = JSON.parse(campaignIds);
    } catch (error) {
      throw new ValidationError('Invalid campaign IDs format');
    }
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.getTransactionsByCampaignInOrg(
    id, 
    parsedCampaignIds, 
    isAdmin === 'true'
  );
  
  sendSuccess(res, transactions, 'Campaign transactions in organization retrieved successfully');
})

/**
 * Additional endpoint for transaction statistics
 */
export const getTransactionStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }
  
  // Delegate to TransactionService
  const stats = await transactionService.getTransactionStats(id);
  
  sendSuccess(res, stats, 'Transaction statistics retrieved successfully');
})

/**
 * Additional endpoint for donor transactions
 */
export const getTransactionsByDonor = asyncHandler(async (req, res) => {
  const { donorId } = req.params;
  const { organizationId } = req.query;
  
  if (!donorId) {
    throw new ValidationError('Donor ID is required');
  }
  
  // Delegate to TransactionService
  const transactions = await transactionService.getTransactionsByDonor(
    donorId, 
    organizationId
  );
  
  sendSuccess(res, transactions, 'Donor transactions retrieved successfully');
})

/**
 * Additional endpoint for updating transaction status
 */
export const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  
  if (!id) {
    throw new ValidationError('Transaction ID is required');
  }
  
  if (!status) {
    throw new ValidationError('Status is required');
  }
  
  try {
    // Delegate to TransactionService
    const transaction = await transactionService.updateTransactionStatus(id, status, reason);
    
    sendUpdated(res, transaction, 'Transaction status updated successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Transaction not found');
    } else {
      throw error;
    }
  }
})

/**
 * Additional endpoint for bulk status updates
 */
export const bulkUpdateTransactionStatus = asyncHandler(async (req, res) => {
  const { transactionIds, status, reason } = req.body;
  
  if (!transactionIds || !Array.isArray(transactionIds)) {
    throw new ValidationError('Transaction IDs array is required');
  }
  
  if (!status) {
    throw new ValidationError('Status is required');
  }
  
  // Delegate to TransactionService
  const results = await transactionService.bulkUpdateTransactionStatus(
    transactionIds, 
    status, 
    reason
  );
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  
  sendSuccess(res, {
    results,
    summary: {
      total: results.length,
      successful: successCount,
      failed: failureCount
    }
  }, `Bulk update completed: ${successCount} successful, ${failureCount} failed`);
})