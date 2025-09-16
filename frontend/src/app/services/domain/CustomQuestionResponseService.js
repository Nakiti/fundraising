import { BaseService } from '../base/BaseService.js';

/**
 * Custom Question Response Service - Handles all custom question response operations
 * Extends BaseService for common API operations and error handling
 */
export class CustomQuestionResponseService extends BaseService {
  constructor() {
    super('CustomQuestionResponseService');
  }

  // ===== CUSTOM QUESTION RESPONSE CRUD OPERATIONS =====

  /**
   * Create a single custom question response
   * @param {Object} responseData - Response data
   * @param {number} responseData.transaction_id - Transaction ID
   * @param {number} responseData.question_id - Question ID
   * @param {number} [responseData.donor_id] - Donor ID (optional)
   * @param {string} responseData.response_value - Response value
   * @param {string} responseData.response_type - Response type (text, textarea, checkbox, select, radio)
   * @returns {Promise<Object>} Created response data
   */
  async createResponse(responseData) {
    this.validateRequired(responseData, 'Response data');
    this.validateRequired(responseData.transaction_id, 'Transaction ID');
    this.validateId(responseData.transaction_id, 'Transaction ID');
    this.validateRequired(responseData.question_id, 'Question ID');
    this.validateId(responseData.question_id, 'Question ID');
    this.validateRequired(responseData.response_value, 'Response value');
    this.validateRequired(responseData.response_type, 'Response type');
    this.validateEnum(responseData.response_type, ['text', 'textarea', 'checkbox', 'select', 'radio'], 'Response type');

    return await this.post('/custom_question_response/', responseData);
  }

  /**
   * Create multiple custom question responses (batch operation)
   * @param {Array} responsesData - Array of response data objects
   * @returns {Promise<Object>} Creation results
   */
  async createResponsesBatch(responsesData) {
    this.validateRequired(responsesData, 'Responses data');
    this.validateArray(responsesData, 'Responses data');

    // Validate each response in the array
    responsesData.forEach((responseData, index) => {
      this.validateRequired(responseData.transaction_id, `Transaction ID at index ${index}`);
      this.validateId(responseData.transaction_id, `Transaction ID at index ${index}`);
      this.validateRequired(responseData.question_id, `Question ID at index ${index}`);
      this.validateId(responseData.question_id, `Question ID at index ${index}`);
      this.validateRequired(responseData.response_value, `Response value at index ${index}`);
      this.validateRequired(responseData.response_type, `Response type at index ${index}`);
      this.validateEnum(responseData.response_type, ['text', 'textarea', 'checkbox', 'select', 'radio'], `Response type at index ${index}`);
    });

    return await this.post('/custom_question_response/batch', { responses: responsesData });
  }

  /**
   * Get a single response by ID
   * @param {number} responseId - Response ID
   * @returns {Promise<Object>} Response data
   */
  async getResponse(responseId) {
    this.validateId(responseId, 'Response ID');
    return await this.get(`/custom_question_response/${responseId}`);
  }

  /**
   * Get responses by transaction ID
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Array>} Array of responses for the transaction
   */
  async getResponsesByTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');
    return await this.get(`/custom_question_response/transaction/${transactionId}`);
  }

  /**
   * Get responses by question ID
   * @param {number} questionId - Question ID
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=100] - Maximum number of responses to return
   * @param {number} [options.offset=0] - Number of responses to skip
   * @returns {Promise<Array>} Array of responses for the question
   */
  async getResponsesByQuestion(questionId, options = {}) {
    this.validateId(questionId, 'Question ID');
    
    const { limit = 100, offset = 0 } = options;
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.get(`/custom_question_response/question/${questionId}?${queryParams}`);
  }

  /**
   * Get responses by donor ID
   * @param {number} donorId - Donor ID
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=100] - Maximum number of responses to return
   * @param {number} [options.offset=0] - Number of responses to skip
   * @returns {Promise<Array>} Array of responses from the donor
   */
  async getResponsesByDonor(donorId, options = {}) {
    this.validateId(donorId, 'Donor ID');
    
    const { limit = 100, offset = 0 } = options;
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.get(`/custom_question_response/donor/${donorId}?${queryParams}`);
  }

  /**
   * Get responses by campaign ID
   * @param {number} campaignId - Campaign ID
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=100] - Maximum number of responses to return
   * @param {number} [options.offset=0] - Number of responses to skip
   * @returns {Promise<Array>} Array of responses for the campaign
   */
  async getResponsesByCampaign(campaignId, options = {}) {
    this.validateId(campaignId, 'Campaign ID');
    
    const { limit = 100, offset = 0 } = options;
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.get(`/custom_question_response/campaign/${campaignId}?${queryParams}`);
  }

  /**
   * Get response statistics for a campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Response statistics
   */
  async getResponseStatistics(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/custom_question_response/campaign/${campaignId}/statistics`);
  }

  /**
   * Update a custom question response
   * @param {number} responseId - Response ID
   * @param {Object} updateData - Data to update
   * @param {string} [updateData.response_value] - New response value
   * @param {string} [updateData.response_type] - New response type
   * @returns {Promise<Object>} Updated response data
   */
  async updateResponse(responseId, updateData) {
    this.validateId(responseId, 'Response ID');
    this.validateRequired(updateData, 'Update data');

    // Validate response type if provided
    if (updateData.response_type) {
      this.validateEnum(updateData.response_type, ['text', 'textarea', 'checkbox', 'select', 'radio'], 'Response type');
    }

    return await this.put(`/custom_question_response/${responseId}`, updateData);
  }

  /**
   * Delete a custom question response
   * @param {number} responseId - Response ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteResponse(responseId) {
    this.validateId(responseId, 'Response ID');
    return await this.delete(`/custom_question_response/${responseId}`);
  }

  /**
   * Delete all responses for a transaction
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteResponsesByTransaction(transactionId) {
    this.validateId(transactionId, 'Transaction ID');
    return await this.delete(`/custom_question_response/transaction/${transactionId}`);
  }

  // ===== UTILITY METHODS =====

  /**
   * Get responses with question details for a transaction
   * @param {number} transactionId - Transaction ID
   * @returns {Promise<Array>} Array of responses with question details
   */
  async getResponsesWithQuestions(transactionId) {
    this.validateId(transactionId, 'Transaction ID');
    return await this.getResponsesByTransaction(transactionId);
  }

  /**
   * Get responses with donor details for a campaign
   * @param {number} campaignId - Campaign ID
   * @param {Object} [options] - Query options
   * @returns {Promise<Array>} Array of responses with donor details
   */
  async getResponsesWithDonors(campaignId, options = {}) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.getResponsesByCampaign(campaignId, options);
  }

  /**
   * Get question response summary for analytics
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Response summary with statistics
   */
  async getResponseSummary(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.getResponseStatistics(campaignId);
  }

  /**
   * Check if a donor has responded to a specific question
   * @param {number} donorId - Donor ID
   * @param {number} questionId - Question ID
   * @returns {Promise<boolean>} True if donor has responded
   */
  async hasDonorResponded(donorId, questionId) {
    this.validateId(donorId, 'Donor ID');
    this.validateId(questionId, 'Question ID');

    try {
      const responses = await this.getResponsesByDonor(donorId, { limit: 1000 });
      return responses.some(response => response.question_id === questionId);
    } catch (error) {
      console.error('Error checking donor response:', error);
      return false;
    }
  }

  /**
   * Get most common responses for a question
   * @param {number} questionId - Question ID
   * @param {number} [limit=10] - Maximum number of responses to return
   * @returns {Promise<Array>} Array of most common responses
   */
  async getMostCommonResponses(questionId, limit = 10) {
    this.validateId(questionId, 'Question ID');
    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');

    try {
      const responses = await this.getResponsesByQuestion(questionId, { limit: 1000 });
      
      // Count response frequencies
      const responseCounts = {};
      responses.forEach(response => {
        const value = response.response_value;
        responseCounts[value] = (responseCounts[value] || 0) + 1;
      });

      // Sort by frequency and return top responses
      return Object.entries(responseCounts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting most common responses:', error);
      return [];
    }
  }

  /**
   * Export responses for a campaign to CSV format
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<string>} CSV formatted string
   */
  async exportResponsesToCSV(campaignId) {
    this.validateId(campaignId, 'Campaign ID');

    try {
      const responses = await this.getResponsesByCampaign(campaignId, { limit: 10000 });
      
      if (responses.length === 0) {
        return 'No responses found for this campaign.';
      }

      // Create CSV headers
      const headers = ['Question', 'Response', 'Donor Name', 'Donor Email', 'Donation Date', 'Amount'];
      const csvRows = [headers.join(',')];

      // Add data rows
      responses.forEach(response => {
        const row = [
          `"${response.question || 'N/A'}"`,
          `"${response.response_value || ''}"`,
          `"${response.first_name || ''} ${response.last_name || ''}"`.trim(),
          `"${response.email || ''}"`,
          `"${response.donation_date || ''}"`,
          response.amount || '0'
        ];
        csvRows.push(row.join(','));
      });

      return csvRows.join('\n');
    } catch (error) {
      console.error('Error exporting responses to CSV:', error);
      throw error;
    }
  }
}



