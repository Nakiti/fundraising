import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from '../utils/errors.js'; 

/**
 * Custom Question Response Service - Handles custom question response business logic
 * Manages donor answers to campaign custom questions
 */
export class CustomQuestionResponseService extends BaseService {
  constructor() {
    super('custom_question_responses');
  } 

  /**
   * Valid response types
   */
  static VALID_RESPONSE_TYPES = ['text', 'textarea', 'checkbox', 'select', 'radio', 'input'];

  /**
   * Validate custom question response data
   * @param {Object} responseData - Response data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  validateResponseData(responseData, isUpdate = false) {
    console.log('responseData', responseData);
    if (!isUpdate) {
      // Required fields for creation
      this.validateRequiredFields(responseData, [
        'transaction_id', 
        'question_id', 
        'response_value', 
        'response_type'
      ]);
    }

    // Validate response type
    if (responseData.response_type && !CustomQuestionResponseService.VALID_RESPONSE_TYPES.includes(responseData.response_type)) {
      throw new ValidationError(`Response type must be one of: ${CustomQuestionResponseService.VALID_RESPONSE_TYPES.join(', ')}`);
    }

    // Validate response value is not empty for non-checkbox types
    if (responseData.response_type && responseData.response_type !== 'checkbox') {
      if (!responseData.response_value || responseData.response_value.trim() === '') {
        throw new ValidationError('Response value cannot be empty for non-checkbox questions');
      }
    }

    // Validate IDs
    if (responseData.transaction_id !== undefined) {
      this.validateId(responseData.transaction_id, 'Transaction ID');
    }
    if (responseData.question_id !== undefined) {
      this.validateId(responseData.question_id, 'Question ID');
    }
    if (responseData.donor_id !== undefined && responseData.donor_id !== null) {
      this.validateId(responseData.donor_id, 'Donor ID');
    }
  }

  /**
   * Create a new custom question response
   * @param {Object} responseData - Response data
   * @returns {Promise<Object>} Created response data
   */
  async createResponse(responseData) {
    this.validateResponseData(responseData, false);

    // Prepare response data with defaults
    const responseToCreate = {
      transaction_id: responseData.transaction_id,
      question_id: responseData.question_id,
      donor_id: responseData.donor_id || null,
      response_value: responseData.response_value,
      response_type: responseData.response_type,
      created_at: new Date()
    };

    // Create response
    const result = await this.create(responseToCreate);
    
    return {
      id: result.insertId,
      ...responseToCreate
    };
  }

  /**
   * Create multiple responses for a transaction (batch operation)
   * @param {Array} responsesData - Array of response data objects
   * @returns {Promise<Object>} Creation results
   */
  async createResponsesBatch(responsesData) {
    if (!Array.isArray(responsesData) || responsesData.length === 0) {
      throw new ValidationError('Responses data must be a non-empty array');
    }

    // Validate all responses
    responsesData.forEach((responseData, index) => {
      try {
        this.validateResponseData(responseData, false);
      } catch (error) {
        throw new ValidationError(`Invalid response data at index ${index}: ${error.message}`);
      }
    });

    // Prepare batch data
    const batchData = responsesData.map(responseData => ({
      transaction_id: responseData.transaction_id,
      question_id: responseData.question_id,
      donor_id: responseData.donor_id || null,
      response_value: responseData.response_value,
      response_type: responseData.response_type,
      created_at: new Date()
    }));

    // Create all responses
    const results = await this.createBatch(batchData);
    
    return {
      createdCount: results.affectedRows,
      responses: batchData.map((response, index) => ({
        id: results.insertId + index,
        ...response
      }))
    };
  }

  /**
   * Get responses by transaction ID
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Array>} Array of responses for the transaction
   */
  async getResponsesByTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');

    const query = `
      SELECT 
        cqr.*,
        cq.question,
        cq.type as question_type
      FROM custom_question_response cqr
      LEFT JOIN campaign_questions cq ON cqr.question_id = cq.id
      WHERE cqr.transaction_id = ?
      ORDER BY cqr.created_at ASC
    `;

    return await this.executeQuery(query, [transactionId]);
  }

  /**
   * Get responses by question ID
   * @param {number} questionId - Question ID
   * @param {Object} options - Query options (limit, offset)
   * @returns {Promise<Array>} Array of responses for the question
   */
  async getResponsesByQuestion(questionId, options = {}) {
    this.validateId(questionId, 'Question ID');

    const { limit = 100, offset = 0 } = options;

    const query = `
      SELECT 
        cqr.*,
        t.amount,
        t.date as donation_date,
        d.first_name,
        d.last_name,
        d.email
      FROM custom_question_response cqr
      LEFT JOIN transactions t ON cqr.transaction_id = t.id
      LEFT JOIN donors d ON cqr.donor_id = d.id
      WHERE cqr.question_id = ?
      ORDER BY cqr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await this.executeQuery(query, [questionId, limit, offset]);
  }

  /**
   * Get responses by donor ID
   * @param {number} donorId - Donor ID
   * @param {Object} options - Query options (limit, offset)
   * @returns {Promise<Array>} Array of responses from the donor
   */
  async getResponsesByDonor(donorId, options = {}) {
    this.validateId(donorId, 'Donor ID');

    const { limit = 100, offset = 0 } = options;

    const query = `
      SELECT 
        cqr.*,
        cq.question,
        cq.type as question_type,
        t.amount,
        t.date as donation_date,
        c.external_name as campaign_name
      FROM custom_question_response cqr
      LEFT JOIN campaign_questions cq ON cqr.question_id = cq.id
      LEFT JOIN transactions t ON cqr.transaction_id = t.id
      LEFT JOIN campaigns c ON t.campaign_id = c.id
      WHERE cqr.donor_id = ?
      ORDER BY cqr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await this.executeQuery(query, [donorId, limit, offset]);
  }

  /**
   * Get responses by campaign ID
   * @param {number} campaignId - Campaign ID
   * @param {Object} options - Query options (limit, offset)
   * @returns {Promise<Array>} Array of responses for the campaign
   */
  async getResponsesByCampaign(campaignId, options = {}) {
    this.validateId(campaignId, 'Campaign ID');

    const { limit = 100, offset = 0 } = options;

    const query = `
      SELECT 
        cqr.*,
        cq.question,
        cq.type as question_type,
        t.amount,
        t.date as donation_date,
        d.first_name,
        d.last_name,
        d.email
      FROM custom_question_response cqr
      LEFT JOIN campaign_questions cq ON cqr.question_id = cq.id
      LEFT JOIN transactions t ON cqr.transaction_id = t.id
      LEFT JOIN donors d ON cqr.donor_id = d.id
      WHERE cq.campaign_id = ?
      ORDER BY cqr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await this.executeQuery(query, [campaignId, limit, offset]);
  }

  /**
   * Update a response
   * @param {number} responseId - Response ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated response data
   */
  async updateResponse(responseId, updateData) {
    this.validateId(responseId, 'Response ID');
    this.validateResponseData(updateData, true);

    // Remove fields that shouldn't be updated
    const allowedFields = ['response_value', 'response_type'];
    const filteredUpdateData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    if (Object.keys(filteredUpdateData).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    const result = await this.update(responseId, filteredUpdateData);
    
    if (result.affectedRows === 0) {
      throw new NotFoundError('Custom question response');
    }

    return await this.getById(responseId);
  }

  /**
   * Delete a response
   * @param {number} responseId - Response ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteResponse(responseId) {
    this.validateId(responseId, 'Response ID');

    const result = await this.delete(responseId);
    
    if (result.affectedRows === 0) {
      throw new NotFoundError('Custom question response');
    }

    return { message: 'Response deleted successfully' };
  }

  /**
   * Delete all responses for a transaction
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteResponsesByTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');

    const query = 'DELETE FROM custom_question_response WHERE transaction_id = ?';
    const result = await this.executeQuery(query, [transactionId]);
    
    return { 
      message: `Deleted ${result.affectedRows} responses for transaction`,
      deletedCount: result.affectedRows
    };
  }

  /**
   * Get response statistics for a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Response statistics
   */
  async getResponseStatistics(campaignId) {
    this.validateId(campaignId, 'Campaign ID');

    const query = `
      SELECT 
        cq.id as question_id,
        cq.question,
        cq.type as question_type,
        COUNT(cqr.id) as response_count,
        COUNT(DISTINCT cqr.transaction_id) as unique_donations
      FROM campaign_questions cq
      LEFT JOIN custom_question_response cqr ON cq.id = cqr.question_id
      WHERE cq.campaign_id = ?
      GROUP BY cq.id, cq.question, cq.type
      ORDER BY cq.id
    `;

    const results = await this.executeQuery(query, [campaignId]);
    
    return {
      campaign_id: campaignId,
      questions: results,
      total_questions: results.length,
      total_responses: results.reduce((sum, q) => sum + q.response_count, 0)
    };
  }
}
