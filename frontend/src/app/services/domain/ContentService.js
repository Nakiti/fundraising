import { BaseService } from '../base/BaseService.js';

/**
 * Content Service - Handles all content-related operations including FAQs, questions, and tickets
 * Extends BaseService for common API operations and error handling
 */
export class ContentService extends BaseService {
  constructor() {
    super('ContentService');
  }

  // ===== FAQ OPERATIONS =====

  /**
   * Get FAQs for a campaign
   */
  async getFaqs(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/faq/get/${campaignId}`);
  }

  /**
   * Create a new FAQ
   */
  async createFaq(faqData) {
    this.validateRequired(faqData, 'FAQ data');
    this.validateRequired(faqData.question, 'Question');
    this.validateRequired(faqData.answer, 'Answer');
    this.validateRequired(faqData.campaign_id, 'Campaign ID');
    this.validateId(faqData.campaign_id, 'Campaign ID');

    return await this.post('/faq/create', faqData);
  }

  /**
   * Update an existing FAQ
   */
  async updateFaq(faqId, updateData) {
    this.validateId(faqId, 'FAQ ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/faq/update/${faqId}`, updateData);
  }

  /**
   * Delete a single FAQ
   */
  async deleteFaq(faqId) {
    this.validateId(faqId, 'FAQ ID');
    return await this.delete(`/faq/delete/${faqId}`);
  }

  /**
   * Delete multiple FAQs in batch
   */
  async deleteFaqsBatch(faqs) {
    this.validateArray(faqs, 'FAQs array');
    this.validateArrayLength(faqs, 1, 100, 'FAQs array');

    return await this.delete('/faq/deleteBatch', {
      data: faqs
    });
  }

  // ===== CUSTOM QUESTIONS OPERATIONS =====

  /**
   * Get custom questions for a campaign
   */
  async getCustomQuestions(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_question/get/${campaignId}`);
  }

  /**
   * Create a custom question
   */
  async createCustomQuestion(questionData) {
    this.validateRequired(questionData, 'Question data');
    this.validateRequired(questionData.campaign_id, 'Campaign ID');
    this.validateRequired(questionData.question_text, 'Question text');
    this.validateRequired(questionData.question_type, 'Question type');
    this.validateId(questionData.campaign_id, 'Campaign ID');
    this.validateEnum(questionData.question_type, ['text', 'textarea', 'select', 'radio', 'checkbox'], 'Question type');

    return await this.post('/campaign_question/create', questionData);
  }

  /**
   * Update a custom question
   */
  async updateCustomQuestion(questionId, updateData) {
    this.validateId(questionId, 'Question ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/campaign_question/update/${questionId}`, updateData);
  }

  /**
   * Delete a custom question
   */
  async deleteCustomQuestion(questionId) {
    this.validateId(questionId, 'Question ID');
    return await this.delete(`/campaign_question/delete/${questionId}`);
  }

  /**
   * Delete multiple custom questions in batch
   */
  async deleteCustomQuestionsBatch(questions) {
    this.validateArray(questions, 'Questions array');
    this.validateArrayLength(questions, 1, 100, 'Questions array');

    return await this.delete('/campaign_question/deleteBatch', {
      data: questions
    });
  }

  // ===== CAMPAIGN TICKETS OPERATIONS =====

  /**
   * Get campaign tickets
   */
  async getCampaignTickets(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/campaign_ticket/get/${campaignId}`);
  }

  /**
   * Create a campaign ticket
   */
  async createCampaignTicket(ticketData) {
    this.validateRequired(ticketData, 'Ticket data');
    this.validateRequired(ticketData.campaign_id, 'Campaign ID');
    this.validateRequired(ticketData.name, 'Ticket name');
    this.validateRequired(ticketData.price, 'Ticket price');
    this.validateRequired(ticketData.quantity, 'Ticket quantity');
    this.validateId(ticketData.campaign_id, 'Campaign ID');
    this.validateRange(ticketData.price, 0, 10000, 'Ticket price');
    this.validateRange(ticketData.quantity, 1, 100000, 'Ticket quantity');

    return await this.post('/campaign_ticket/create', ticketData);
  }

  /**
   * Update a campaign ticket
   */
  async updateCampaignTicket(ticketId, updateData) {
    this.validateId(ticketId, 'Ticket ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/campaign_ticket/update/${ticketId}`, updateData);
  }

  /**
   * Delete a campaign ticket
   */
  async deleteCampaignTicket(ticketId) {
    this.validateId(ticketId, 'Ticket ID');
    return await this.delete(`/campaign_ticket/delete/${ticketId}`);
  }

  /**
   * Delete multiple campaign tickets in batch
   */
  async deleteCampaignTicketsBatch(tickets) {
    this.validateArray(tickets, 'Tickets array');
    this.validateArrayLength(tickets, 1, 100, 'Tickets array');

    return await this.delete('/campaign_ticket/deleteBatch', {
      data: tickets
    });
  }

  // ===== CONTENT VALIDATION =====

  /**
   * Validate FAQ data
   */
  validateFaqData(faqData) {
    this.validateRequired(faqData.question, 'Question');
    this.validateRequired(faqData.answer, 'Answer');
    this.validateMinLength(faqData.question, 5, 'Question');
    this.validateMinLength(faqData.answer, 10, 'Answer');
    this.validateMaxLength(faqData.question, 500, 'Question');
    this.validateMaxLength(faqData.answer, 2000, 'Answer');
  }

  /**
   * Validate question data
   */
  validateQuestionData(questionData) {
    this.validateRequired(questionData.question_text, 'Question text');
    this.validateMinLength(questionData.question_text, 5, 'Question text');
    this.validateMaxLength(questionData.question_text, 500, 'Question text');
    
    if (questionData.options && Array.isArray(questionData.options)) {
      this.validateArrayLength(questionData.options, 2, 10, 'Question options');
      questionData.options.forEach((option, index) => {
        this.validateRequired(option, `Option ${index + 1}`);
        this.validateMinLength(option, 1, `Option ${index + 1}`);
        this.validateMaxLength(option, 200, `Option ${index + 1}`);
      });
    }
  }

  /**
   * Validate ticket data
   */
  validateTicketData(ticketData) {
    this.validateRequired(ticketData.name, 'Ticket name');
    this.validateRequired(ticketData.price, 'Ticket price');
    this.validateRequired(ticketData.quantity, 'Ticket quantity');
    this.validateMinLength(ticketData.name, 2, 'Ticket name');
    this.validateMaxLength(ticketData.name, 100, 'Ticket name');
    this.validateRange(ticketData.price, 0, 10000, 'Ticket price');
    this.validateRange(ticketData.quantity, 1, 100000, 'Ticket quantity');
  }

  // ===== CONTENT QUERIES =====

  /**
   * Search FAQs by campaign and query
   */
  async searchFaqs(campaignId, query, filters = {}) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(query, 'Search query');
    
    const params = { q: query, ...filters };
    return await this.getWithQuery(`/faq/search/${campaignId}`, params);
  }

  /**
   * Get FAQs by category
   */
  async getFaqsByCategory(campaignId, category) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(category, 'Category');
    
    return await this.getWithQuery(`/faq/category/${campaignId}`, { category });
  }

  /**
   * Get questions by type
   */
  async getQuestionsByType(campaignId, questionType) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(questionType, 'Question type');
    this.validateEnum(questionType, ['text', 'textarea', 'select', 'radio', 'checkbox'], 'Question type');
    
    return await this.getWithQuery(`/campaign_question/type/${campaignId}`, { type: questionType });
  }

  /**
   * Get tickets by price range
   */
  async getTicketsByPriceRange(campaignId, minPrice, maxPrice) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRange(minPrice, 0, 10000, 'Minimum price');
    this.validateRange(maxPrice, minPrice, 10000, 'Maximum price');
    
    return await this.getWithQuery(`/campaign_ticket/priceRange/${campaignId}`, { 
      minPrice, 
      maxPrice 
    });
  }

  // ===== CONTENT ANALYTICS =====

  /**
   * Get content statistics for a campaign
   */
  async getContentStats(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/content/stats/${campaignId}`);
  }

  /**
   * Get FAQ engagement metrics
   */
  async getFaqEngagement(campaignId, dateRange = '30d') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/faq/engagement/${campaignId}`, { range: dateRange });
  }

  /**
   * Get question response analytics
   */
  async getQuestionAnalytics(campaignId, questionId = null) {
    this.validateId(campaignId, 'Campaign ID');
    
    const params = {};
    if (questionId) {
      this.validateId(questionId, 'Question ID');
      params.questionId = questionId;
    }
    
    return await this.getWithQuery(`/campaign_question/analytics/${campaignId}`, params);
  }

  /**
   * Get ticket sales analytics
   */
  async getTicketSalesAnalytics(campaignId, dateRange = '30d') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    
    return await this.getWithQuery(`/campaign_ticket/sales/${campaignId}`, { range: dateRange });
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk create FAQs
   */
  async bulkCreateFaqs(faqs) {
    this.validateArray(faqs, 'FAQs array');
    this.validateArrayLength(faqs, 1, 50, 'FAQs array');
    
    // Validate each FAQ
    faqs.forEach((faq, index) => {
      try {
        this.validateFaqData(faq);
      } catch (error) {
        throw new Error(`FAQ ${index + 1}: ${error.message}`);
      }
    });

    return await this.post('/faq/bulkCreate', { faqs });
  }

  /**
   * Bulk create questions
   */
  async bulkCreateQuestions(questions) {
    this.validateArray(questions, 'Questions array');
    this.validateArrayLength(questions, 1, 50, 'Questions array');
    
    // Validate each question
    questions.forEach((question, index) => {
      try {
        this.validateQuestionData(question);
      } catch (error) {
        throw new Error(`Question ${index + 1}: ${error.message}`);
      }
    });

    return await this.post('/campaign_question/bulkCreate', { questions });
  }

  /**
   * Bulk create tickets
   */
  async bulkCreateTickets(tickets) {
    this.validateArray(tickets, 'Tickets array');
    this.validateArrayLength(tickets, 1, 50, 'Tickets array');
    
    // Validate each ticket
    tickets.forEach((ticket, index) => {
      try {
        this.validateTicketData(ticket);
      } catch (error) {
        throw new Error(`Ticket ${index + 1}: ${error.message}`);
      }
    });

    return await this.post('/campaign_ticket/bulkCreate', { tickets });
  }

  // ===== CONTENT EXPORT =====

  /**
   * Export campaign content
   */
  async exportCampaignContent(campaignId, format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/content/export/${campaignId}`, { format });
  }

  /**
   * Export FAQs
   */
  async exportFaqs(campaignId, format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/faq/export/${campaignId}`, { format });
  }

  /**
   * Export questions
   */
  async exportQuestions(campaignId, format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/campaign_question/export/${campaignId}`, { format });
  }

  /**
   * Export tickets
   */
  async exportTickets(campaignId, format = 'json') {
    this.validateId(campaignId, 'Campaign ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    return await this.getWithQuery(`/campaign_ticket/export/${campaignId}`, { format });
  }
}

