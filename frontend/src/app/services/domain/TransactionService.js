import { BaseService } from '../base/BaseService.js';

/**
 * Transaction Service - Handles all transaction-related operations
 * Extends BaseService for common API operations and error handling
 */
export class TransactionService extends BaseService {
  constructor() {
    super('TransactionService');
  }

  // ===== TRANSACTION CRUD OPERATIONS =====

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');
    return await this.get(`/transaction/get/${transactionId}`);
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transactionData) {
    this.validateRequired(transactionData, 'Transaction data');
    this.validateRequired(transactionData.amount, 'Amount');
    this.validateCurrency(transactionData.amount, 'Amount');
    this.validateRequired(transactionData.campaign_id, 'Campaign ID');
    this.validateId(transactionData.campaign_id, 'Campaign ID');

    return await this.post('/transaction/create', transactionData);
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(transactionId, updateData) {
    this.validateId(transactionId, 'Transaction ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/transaction/update/${transactionId}`, updateData);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');
    return await this.delete(`/transaction/delete/${transactionId}`);
  }

  // ===== TRANSACTION QUERIES =====

  /**
   * Get transactions by organization
   */
  async getTransactionsByOrganization(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/transaction/org/${organizationId}`, params);
  }

  /**
   * Get transactions by campaign
   */
  async getTransactionsByCampaign(campaignId, filters = {}) {
    this.validateId(campaignId, 'Campaign ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/transaction/campaign/${campaignId}`, params);
  }

  /**
   * Get transactions by user
   */
  async getTransactionsByUser(userId, filters = {}) {
    this.validateId(userId, 'User ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/transaction/user/${userId}`, params);
  }

  /**
   * Get transactions over time
   */
  async getTransactionsOverTime(start, end, organizationId) {
    this.validateDate(start, 'Start date');
    this.validateDate(end, 'End date');
    this.validateId(organizationId, 'Organization ID');
    
    const startFormatted = this.formatDate(start);
    const endFormatted = this.formatDate(end);
    
    return await this.getWithQuery(`/transaction/time/${organizationId}`, {
      start: startFormatted,
      end: endFormatted
    });
  }

  /**
   * Get transactions by date range
   */
  async getTransactionsByDateRange(start, end, filters = {}) {
    this.validateDate(start, 'Start date');
    this.validateDate(end, 'End date');
    
    const startFormatted = this.formatDate(start);
    const endFormatted = this.formatDate(end);
    
    const params = {
      start: startFormatted,
      end: endFormatted,
      ...filters
    };
    
    return await this.getWithQuery('/transaction/daterange', params);
  }

  /**
   * Get filtered transactions
   */
  async getFilteredTransactions(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const { status, type, minAmount, maxAmount, limit, offset } = filters;
    const params = {};
    
    if (status && status !== 'all') params.status = status;
    if (type && type !== 'all') params.type = type;
    if (minAmount) params.minAmount = minAmount;
    if (maxAmount) params.maxAmount = maxAmount;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    
    return await this.getWithQuery(`/transaction/filtered/${organizationId}`, params);
  }

  /**
   * Search transactions
   */
  async searchTransactions(query, organizationId, filters = {}) {
    this.validateRequired(query, 'Search query');
    this.validateId(organizationId, 'Organization ID');
    
    const params = { q: query, ...filters };
    return await this.getWithQuery(`/transaction/search/${organizationId}`, params);
  }

  // ===== TRANSACTION ANALYTICS =====

  /**
   * Get transaction statistics
   */
  async getTransactionStats(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/transaction/stats/${organizationId}`, { range: dateRange });
  }

  /**
   * Get transaction trends
   */
  async getTransactionTrends(organizationId, period = 'daily', dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(period, ['hourly', 'daily', 'weekly', 'monthly'], 'Period');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/transaction/trends/${organizationId}`, { period, range: dateRange });
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/transaction/revenue/${organizationId}`, { range: dateRange });
  }

  /**
   * Get donor analytics
   */
  async getDonorAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/transaction/donors/${organizationId}`, { range: dateRange });
  }

  /**
   * Get campaign performance analytics
   */
  async getCampaignPerformanceAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/transaction/campaign-performance/${organizationId}`, { range: dateRange });
  }

  // ===== TRANSACTION PROCESSING =====

  /**
   * Process payment
   */
  async processPayment(paymentData) {
    this.validateRequired(paymentData, 'Payment data');
    this.validateRequired(paymentData.amount, 'Amount');
    this.validateCurrency(paymentData.amount, 'Amount');
    this.validateRequired(paymentData.campaign_id, 'Campaign ID');
    this.validateId(paymentData.campaign_id, 'Campaign ID');

    return await this.post('/transaction/process-payment', paymentData);
  }

  /**
   * Refund transaction
   */
  async refundTransaction(transactionId, refundData) {
    this.validateId(transactionId, 'Transaction ID');
    this.validateRequired(refundData.reason, 'Refund reason');
    this.validateRequired(refundData.amount, 'Refund amount');
    this.validateCurrency(refundData.amount, 'Refund amount');

    return await this.post(`/transaction/refund/${transactionId}`, refundData);
  }

  /**
   * Void transaction
   */
  async voidTransaction(transactionId, voidData) {
    this.validateId(transactionId, 'Transaction ID');
    this.validateRequired(voidData.reason, 'Void reason');

    return await this.post(`/transaction/void/${transactionId}`, voidData);
  }

  /**
   * Capture pending transaction
   */
  async captureTransaction(transactionId, captureData) {
    this.validateId(transactionId, 'Transaction ID');
    this.validateRequired(captureData.amount, 'Capture amount');
    this.validateCurrency(captureData.amount, 'Capture amount');

    return await this.post(`/transaction/capture/${transactionId}`, captureData);
  }

  // ===== TRANSACTION VALIDATION =====

  /**
   * Validate transaction data
   */
  validateTransactionData(transactionData) {
    this.validateRequired(transactionData.amount, 'Amount');
    this.validateCurrency(transactionData.amount, 'Amount');
    this.validateRequired(transactionData.campaign_id, 'Campaign ID');
    this.validateId(transactionData.campaign_id, 'Campaign ID');
    
    if (transactionData.donor_email) {
      this.validateEmail(transactionData.donor_email, 'Donor email');
    }
    
    if (transactionData.donor_name) {
      this.validateMinLength(transactionData.donor_name, 2, 'Donor name');
    }
    
    if (transactionData.designation_id) {
      this.validateId(transactionData.designation_id, 'Designation ID');
    }
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(paymentMethod) {
    this.validateRequired(paymentMethod, 'Payment method');
    this.validateEnum(paymentMethod.type, ['card', 'bank', 'paypal', 'apple_pay', 'google_pay'], 'Payment method type');
    
    if (paymentMethod.type === 'card') {
      this.validateRequired(paymentMethod.token, 'Payment token');
    }
  }

  // ===== TRANSACTION EXPORT =====

  /**
   * Export transactions
   */
  async exportTransactions(organizationId, format = 'json', filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(format, ['json', 'csv', 'pdf', 'xlsx'], 'Export format');
    
    const params = { format, ...filters };
    return await this.getWithQuery(`/transaction/export/${organizationId}`, params);
  }

  /**
   * Export transaction analytics
   */
  async exportTransactionAnalytics(organizationId, dateRange = '30d', format = 'json') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf', 'xlsx'], 'Export format');
    
    return await this.getWithQuery(`/transaction/exportAnalytics/${organizationId}`, {
      range: dateRange,
      format
    });
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update transaction statuses
   */
  async bulkUpdateStatus(transactionIds, status) {
    this.validateArray(transactionIds, 'Transaction IDs');
    this.validateEnum(status, ['pending', 'completed', 'failed', 'refunded', 'voided'], 'Status');
    
    return await this.put('/transaction/bulkUpdateStatus', {
      transactionIds,
      status
    });
  }

  /**
   * Bulk refund transactions
   */
  async bulkRefund(transactionIds, refundData) {
    this.validateArray(transactionIds, 'Transaction IDs');
    this.validateRequired(refundData.reason, 'Refund reason');
    
    return await this.post('/transaction/bulkRefund', {
      transactionIds,
      ...refundData
    });
  }

  // ===== TRANSACTION WEBHOOKS =====

  /**
   * Process webhook event
   */
  async processWebhookEvent(webhookData) {
    this.validateRequired(webhookData, 'Webhook data');
    this.validateRequired(webhookData.type, 'Webhook type');
    this.validateRequired(webhookData.data, 'Webhook data');
    
    return await this.post('/transaction/webhook', webhookData);
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/transaction/webhooks/${organizationId}`, params);
  }
}
