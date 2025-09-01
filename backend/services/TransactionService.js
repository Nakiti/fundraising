import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js';

/**
 * Transaction Service - Handles transaction-related business logic
 * Manages donations, payments, and financial operations
 */
export class TransactionService extends BaseService {
  constructor() {
    super('transactions');
  }

  /**
   * Valid transaction statuses
   */
  static VALID_STATUSES = ['pending', 'completed', 'failed', 'cancelled', 'refunded'];

  /**
   * Valid payment methods
   */
  static VALID_METHODS = ['card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay', 'cash', 'check'];

  /**
   * Valid payment method types for Stripe
   */
  static VALID_PAYMENT_METHOD_TYPES = ['card', 'bank_account', 'sepa_debit', 'ideal', 'sofort'];

  /**
   * Validate transaction data
   * @param {Object} transactionData - Transaction data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateTransactionData(transactionData, isUpdate = false) {
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(transactionData, [
        'campaign_id', 
        'organization_id', 
        'amount', 
        'status', 
        'method'
      ]);
    }

    // Validate amount
    if (transactionData.amount !== undefined) {
      const amount = parseFloat(transactionData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new ValidationError('Amount must be a positive number');
      }
      if (amount > 1000000) {
        throw new ValidationError('Amount cannot exceed $1,000,000');
      }
    }

    // Validate status
    if (transactionData.status && !TransactionService.VALID_STATUSES.includes(transactionData.status)) {
      throw new ValidationError(`Status must be one of: ${TransactionService.VALID_STATUSES.join(', ')}`);
    }

    // Validate method
    if (transactionData.method && !TransactionService.VALID_METHODS.includes(transactionData.method)) {
      throw new ValidationError(`Method must be one of: ${TransactionService.VALID_METHODS.join(', ')}`);
    }

    // Validate payment method type
    if (transactionData.payment_method_type && !TransactionService.VALID_PAYMENT_METHOD_TYPES.includes(transactionData.payment_method_type)) {
      throw new ValidationError(`Payment method type must be one of: ${TransactionService.VALID_PAYMENT_METHOD_TYPES.join(', ')}`);
    }

    // Validate processing fee and net amount
    if (transactionData.processing_fee !== undefined) {
      const processingFee = parseFloat(transactionData.processing_fee);
      if (isNaN(processingFee) || processingFee < 0) {
        throw new ValidationError('Processing fee must be a non-negative number');
      }
    }

    if (transactionData.net_amount !== undefined) {
      const netAmount = parseFloat(transactionData.net_amount);
      if (isNaN(netAmount) || netAmount < 0) {
        throw new ValidationError('Net amount must be a non-negative number');
      }
    }

    // Validate application fee
    if (transactionData.application_fee !== undefined) {
      const applicationFee = parseFloat(transactionData.application_fee);
      if (isNaN(applicationFee) || applicationFee < 0) {
        throw new ValidationError('Application fee must be a non-negative number');
      }
    }

    // Validate boolean fields
    if (transactionData.is_anonymous !== undefined) {
      transactionData.is_anonymous = !!transactionData.is_anonymous;
    }
  }

  /**
   * Calculate net amount and fees
   * @param {number} amount - Gross transaction amount
   * @param {number} processingFee - Processing fee
   * @param {number} applicationFee - Application fee
   * @returns {Object} Calculated amounts
   */
  calculateTransactionAmounts(amount, processingFee = 0, applicationFee = 0) {
    const grossAmount = parseFloat(amount);
    const totalFees = parseFloat(processingFee) + parseFloat(applicationFee);
    const netAmount = grossAmount - totalFees;

    return {
      gross_amount: grossAmount,
      processing_fee: parseFloat(processingFee),
      application_fee: parseFloat(applicationFee),
      total_fees: totalFees,
      net_amount: Math.max(0, netAmount) // Ensure net amount is not negative
    };
  }

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction data
   */
  async createTransaction(transactionData) {
    // Validate input data
    this.validateTransactionData(transactionData, false);

    // Calculate amounts if processing fee is provided
    const amounts = this.calculateTransactionAmounts(
      transactionData.amount,
      transactionData.processing_fee || 0,
      transactionData.application_fee || 0
    );

    // Prepare transaction data with defaults and calculations
    const transactionToCreate = {
      campaign_id: transactionData.campaign_id,
      organization_id: transactionData.organization_id,
      donor_id: transactionData.donor_id || null,
      amount: amounts.gross_amount,
      status: transactionData.status,
      method: transactionData.method,
      date: new Date(),
      stripe_payment_intent_id: transactionData.stripe_payment_intent_id || null,
      stripe_charge_id: transactionData.stripe_charge_id || null,
      stripe_customer_id: transactionData.stripe_customer_id || null,
      processing_fee: amounts.processing_fee,
      net_amount: amounts.net_amount,
      application_fee: amounts.application_fee,
      payment_method_type: transactionData.payment_method_type || 'card',
      designation_id: transactionData.designation_id || null,
      is_anonymous: transactionData.is_anonymous || false
    };

    // Create transaction
    const result = await this.create(transactionToCreate);
    
    return {
      id: result.insertId,
      ...transactionToCreate,
      ...amounts
    };
  }

  /**
   * Update an existing transaction
   * @param {number} transactionId - Transaction ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated transaction data
   */
  async updateTransaction(transactionId, updateData) {
    // Validate input data
    this.validateTransactionData(updateData, true);

    // Check if transaction exists
    const existingTransaction = await this.findById(transactionId);
    if (!existingTransaction) {
      throw new NotFoundError('Transaction not found');
    }

    // Recalculate amounts if amount or fees are being updated
    let calculatedAmounts = {};
    if (updateData.amount || updateData.processing_fee || updateData.application_fee) {
      calculatedAmounts = this.calculateTransactionAmounts(
        updateData.amount || existingTransaction.amount,
        updateData.processing_fee !== undefined ? updateData.processing_fee : existingTransaction.processing_fee,
        updateData.application_fee !== undefined ? updateData.application_fee : existingTransaction.application_fee
      );
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      ...calculatedAmounts,
      updated_at: new Date()
    };

    // Update transaction
    await this.update(transactionId, dataToUpdate);

    // Return updated transaction
    return await this.findById(transactionId);
  }

  /**
   * Get transaction by ID
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction data
   */
  async getTransaction(transactionId) {
    if (!transactionId) {
      throw new ValidationError('Transaction ID is required');
    }

    const transaction = await this.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  /**
   * Get transactions by campaign with privacy controls
   * @param {number} campaignId - Campaign ID
   * @param {boolean} isAdmin - Whether requester has admin privileges
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactionsByCampaign(campaignId, isAdmin = false) {
    if (!campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    const query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name,
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Anonymous'
          ELSE donors.first_name
        END as first_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Donor'
          ELSE donors.last_name
        END as last_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN NULL
          ELSE donors.email
        END as email, 
        donors.is_guest,
        transactions.is_anonymous
      FROM transactions 
      INNER JOIN campaign_details ON transactions.campaign_id = campaign_details.campaign_id 
      LEFT JOIN donors ON transactions.donor_id = donors.id
      WHERE transactions.campaign_id = ?
      ORDER BY transactions.date DESC
    `;

    const results = await this.executeQuery(query, [isAdmin, isAdmin, isAdmin, campaignId]);
    return results || [];
  }

  /**
   * Get all transactions for an organization with privacy controls
   * @param {number} organizationId - Organization ID
   * @param {boolean} isAdmin - Whether requester has admin privileges
   * @returns {Promise<Array>} Array of transactions
   */
  async getAllTransactions(organizationId, isAdmin = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Anonymous'
          ELSE donors.first_name
        END as first_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Donor'
          ELSE donors.last_name
        END as last_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN NULL
          ELSE donors.email
        END as email, 
        donors.is_guest,
        transactions.is_anonymous
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id
      INNER JOIN campaign_details ON campaign_details.campaign_id = campaigns.id
      LEFT JOIN donors ON transactions.donor_id = donors.id 
      WHERE transactions.organization_id = ?
      ORDER BY transactions.date DESC
    `;

    const results = await this.executeQuery(query, [isAdmin, isAdmin, isAdmin, organizationId]);
    return results || [];
  }

  /**
   * Get transactions over time for analytics
   * @param {number} organizationId - Organization ID
   * @param {string} period - Time period ('day', 'week', 'month', 'year')
   * @param {number} limit - Number of periods to return
   * @returns {Promise<Array>} Transaction analytics data
   */
  async getTransactionsOverTime(organizationId, period = 'day', limit = 30) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const validPeriods = ['day', 'week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      throw new ValidationError(`Period must be one of: ${validPeriods.join(', ')}`);
    }

    let dateFormat, intervalClause;
    switch (period) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        intervalClause = 'INTERVAL 1 DAY';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        intervalClause = 'INTERVAL 1 WEEK';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        intervalClause = 'INTERVAL 1 MONTH';
        break;
      case 'year':
        dateFormat = '%Y';
        intervalClause = 'INTERVAL 1 YEAR';
        break;
    }

    const query = `
      SELECT 
        DATE_FORMAT(date, '${dateFormat}') as period,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount,
        COUNT(DISTINCT donor_id) as unique_donors
      FROM transactions 
      WHERE organization_id = ? 
      AND status = 'completed'
      AND date >= DATE_SUB(NOW(), ${intervalClause} * ?)
      GROUP BY DATE_FORMAT(date, '${dateFormat}')
      ORDER BY period DESC
      LIMIT ?
    `;

    const results = await this.executeQuery(query, [organizationId, limit, limit]);
    return results || [];
  }

  /**
   * Search transactions with various criteria
   * @param {number} organizationId - Organization ID
   * @param {string} searchTerm - Search term
   * @param {boolean} isAdmin - Whether requester has admin privileges
   * @returns {Promise<Array>} Array of matching transactions
   */
  async searchTransactions(organizationId, searchTerm, isAdmin = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new ValidationError('Search term is required');
    }

    const query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name,
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Anonymous'
          ELSE donors.first_name
        END as first_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Donor'
          ELSE donors.last_name
        END as last_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN NULL
          ELSE donors.email
        END as email, 
        donors.is_guest,
        transactions.is_anonymous
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id
      INNER JOIN campaign_details ON campaign_details.campaign_id = campaigns.id
      LEFT JOIN donors ON transactions.donor_id = donors.id 
      WHERE transactions.organization_id = ?
      AND (
        CONCAT(COALESCE(donors.first_name, ''), ' ', COALESCE(donors.last_name, '')) LIKE ? OR
        CAST(transactions.id AS CHAR) LIKE ? OR
        CAST(transactions.amount AS CHAR) LIKE ? OR
        transactions.status LIKE ? OR
        campaign_details.external_name LIKE ? OR
        donors.email LIKE ?
      )
      ORDER BY transactions.date DESC
    `;

    const searchPattern = `%${searchTerm.trim()}%`;
    const results = await this.executeQuery(query, [
      isAdmin, isAdmin, isAdmin, organizationId,
      searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern
    ]);

    return results || [];
  }

  /**
   * Get filtered transactions by status
   * @param {number} organizationId - Organization ID
   * @param {string} status - Transaction status to filter by
   * @param {boolean} isAdmin - Whether requester has admin privileges
   * @returns {Promise<Array>} Array of filtered transactions
   */
  async getFilteredTransactions(organizationId, status = null, isAdmin = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (status && !TransactionService.VALID_STATUSES.includes(status)) {
      throw new ValidationError(`Status must be one of: ${TransactionService.VALID_STATUSES.join(', ')}`);
    }

    let query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name,
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Anonymous'
          ELSE donors.first_name
        END as first_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Donor'
          ELSE donors.last_name
        END as last_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN NULL
          ELSE donors.email
        END as email, 
        donors.is_guest,
        transactions.is_anonymous
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id
      INNER JOIN campaign_details ON campaign_details.campaign_id = campaigns.id
      LEFT JOIN donors ON transactions.donor_id = donors.id 
      WHERE transactions.organization_id = ?
    `;

    const params = [isAdmin, isAdmin, isAdmin, organizationId];

    if (status) {
      query += ' AND transactions.status = ?';
      params.push(status);
    }

    query += ' ORDER BY transactions.date DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get transactions for campaigns within an organization
   * @param {number} organizationId - Organization ID
   * @param {Array<number>} campaignIds - Array of campaign IDs (optional)
   * @param {boolean} isAdmin - Whether requester has admin privileges
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactionsByCampaignInOrg(organizationId, campaignIds = null, isAdmin = false) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    let query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name,
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Anonymous'
          ELSE donors.first_name
        END as first_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN 'Donor'
          ELSE donors.last_name
        END as last_name, 
        CASE 
          WHEN transactions.is_anonymous = TRUE AND ? = FALSE THEN NULL
          ELSE donors.email
        END as email, 
        donors.is_guest,
        transactions.is_anonymous
      FROM transactions 
      INNER JOIN campaigns ON transactions.campaign_id = campaigns.id
      INNER JOIN campaign_details ON campaign_details.campaign_id = campaigns.id
      LEFT JOIN donors ON transactions.donor_id = donors.id 
      WHERE transactions.organization_id = ?
    `;

    const params = [isAdmin, isAdmin, isAdmin, organizationId];

    if (campaignIds && Array.isArray(campaignIds) && campaignIds.length > 0) {
      const placeholders = campaignIds.map(() => '?').join(',');
      query += ` AND transactions.campaign_id IN (${placeholders})`;
      params.push(...campaignIds);
    }

    query += ' ORDER BY transactions.date DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Get transaction statistics for an organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Transaction statistics
   */
  async getTransactionStats(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_transactions,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_transactions,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount END), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN net_amount END), 0) as total_net_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN processing_fee END), 0) as total_processing_fees,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN application_fee END), 0) as total_application_fees,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN amount END), 0) as average_transaction_amount,
        COUNT(DISTINCT donor_id) as unique_donors,
        COUNT(DISTINCT campaign_id) as campaigns_with_donations
      FROM transactions 
      WHERE organization_id = ?
    `;

    const results = await this.executeQuery(query, [organizationId]);
    const stats = results[0] || {};

    return {
      total_transactions: parseInt(stats.total_transactions) || 0,
      completed_transactions: parseInt(stats.completed_transactions) || 0,
      pending_transactions: parseInt(stats.pending_transactions) || 0,
      failed_transactions: parseInt(stats.failed_transactions) || 0,
      cancelled_transactions: parseInt(stats.cancelled_transactions) || 0,
      refunded_transactions: parseInt(stats.refunded_transactions) || 0,
      total_amount: parseFloat(stats.total_amount) || 0,
      total_net_amount: parseFloat(stats.total_net_amount) || 0,
      total_processing_fees: parseFloat(stats.total_processing_fees) || 0,
      total_application_fees: parseFloat(stats.total_application_fees) || 0,
      average_transaction_amount: parseFloat(stats.average_transaction_amount) || 0,
      unique_donors: parseInt(stats.unique_donors) || 0,
      campaigns_with_donations: parseInt(stats.campaigns_with_donations) || 0,
      success_rate: stats.total_transactions > 0 
        ? ((stats.completed_transactions / stats.total_transactions) * 100).toFixed(2)
        : 0
    };
  }

  /**
   * Get transactions by donor
   * @param {number} donorId - Donor ID
   * @param {number} organizationId - Organization ID (optional, for filtering)
   * @returns {Promise<Array>} Array of donor transactions
   */
  async getTransactionsByDonor(donorId, organizationId = null) {
    if (!donorId) {
      throw new ValidationError('Donor ID is required');
    }

    let query = `
      SELECT 
        transactions.*, 
        campaign_details.external_name,
        donors.first_name,
        donors.last_name,
        donors.email,
        donors.is_guest
      FROM transactions 
      INNER JOIN campaign_details ON transactions.campaign_id = campaign_details.campaign_id
      LEFT JOIN donors ON transactions.donor_id = donors.id 
      WHERE transactions.donor_id = ?
    `;

    const params = [donorId];

    if (organizationId) {
      query += ' AND transactions.organization_id = ?';
      params.push(organizationId);
    }

    query += ' ORDER BY transactions.date DESC';

    const results = await this.executeQuery(query, params);
    return results || [];
  }

  /**
   * Update transaction status
   * @param {number} transactionId - Transaction ID
   * @param {string} status - New status
   * @param {string} reason - Reason for status change (optional)
   * @returns {Promise<Object>} Updated transaction
   */
  async updateTransactionStatus(transactionId, status, reason = null) {
    if (!transactionId) {
      throw new ValidationError('Transaction ID is required');
    }

    if (!status || !TransactionService.VALID_STATUSES.includes(status)) {
      throw new ValidationError(`Status must be one of: ${TransactionService.VALID_STATUSES.join(', ')}`);
    }

    const updateData = {
      status,
      updated_at: new Date()
    };

    if (reason) {
      updateData.status_reason = reason;
    }

    return await this.updateTransaction(transactionId, updateData);
  }

  /**
   * Bulk update transaction statuses
   * @param {Array<number>} transactionIds - Array of transaction IDs
   * @param {string} status - New status to set
   * @param {string} reason - Reason for status change (optional)
   * @returns {Promise<Array>} Array of update results
   */
  async bulkUpdateTransactionStatus(transactionIds, status, reason = null) {
    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      throw new ValidationError('Transaction IDs array is required and cannot be empty');
    }

    if (!status || !TransactionService.VALID_STATUSES.includes(status)) {
      throw new ValidationError(`Status must be one of: ${TransactionService.VALID_STATUSES.join(', ')}`);
    }

    const results = [];

    for (const transactionId of transactionIds) {
      try {
        const updatedTransaction = await this.updateTransactionStatus(transactionId, status, reason);
        results.push({
          success: true,
          transactionId,
          transaction: updatedTransaction
        });
      } catch (error) {
        results.push({
          success: false,
          transactionId,
          error: error.message
        });
      }
    }

    return results;
  }
}
