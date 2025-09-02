import { BaseService } from '../base/BaseService.js';

/**
 * Donor Service - Handles all donor-related operations
 * Extends BaseService for common API operations and error handling
 */
export class DonorService extends BaseService {
  constructor() {
    super('DonorService');
  }

  // ===== DONOR SESSION & AUTHENTICATION =====

  /**
   * Check donor session status
   * @returns {Promise<Object>} Session status
   */
  async checkSession() {
    const response = await this.get('/donor/session');
    return response.success ? response.data : { authenticated: false };
  }

  /**
   * Validate donor session with token
   * @param {string} sessionToken - Session token to validate
   * @returns {Promise<boolean>} Whether session is valid
   */
  async validateSession(sessionToken) {
    if (!sessionToken) {
      return false;
    }

    try {
      const response = await this.get('/donor/session');
      return response.success && response.data.authenticated;
    } catch (error) {
      this.logError('Error validating donor session', error);
      return false;
    }
  }

  /**
   * Login donor
   * @param {string} organizationId - The organization ID
   * @param {string} email - Donor email
   * @param {string} password - Donor password
   * @returns {Promise<Object>} Login response
   */
  async loginDonor(organizationId, email, password) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(email, 'Email');
    this.validateRequired(password, 'Password');
    this.validateEmail(email);

    const response = await this.post(`/donor/${organizationId}/login`, {
      email,
      password
    });

    return response.success ? response.data : null;
  }

  /**
   * Logout donor
   * @returns {Promise<boolean>} Logout success
   */
  async logoutDonor() {
    try {
      const response = await this.post('/donor/logout');
      return response.success;
    } catch (error) {
      this.logError('Error logging out donor', error);
      throw error;
    }
  }

  // ===== DONOR REGISTRATION & CREATION =====

  /**
   * Register new donor
   * @param {string} organizationId - The organization ID
   * @param {Object} donorData - Donor registration data
   * @param {string} donorData.email - Donor email
   * @param {string} donorData.password - Donor password
   * @param {string} donorData.firstName - Donor first name
   * @param {string} donorData.lastName - Donor last name
   * @returns {Promise<Object>} Registration response
   */
  async registerDonor(organizationId, donorData) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(donorData, 'Donor data');
    this.validateRequired(donorData.email, 'Email');
    this.validateRequired(donorData.password, 'Password');
    this.validateRequired(donorData.firstName, 'First Name');
    this.validateRequired(donorData.lastName, 'Last Name');
    this.validateEmail(donorData.email);
    this.validateMinLength(donorData.password, 6, 'Password');

    const response = await this.post(`/donor/${organizationId}/register`, donorData);
    return response.success ? response.data : null;
  }

  /**
   * Convert guest donor to registered donor
   * @param {string} organizationId - The organization ID
   * @param {Object} conversionData - Conversion data
   * @param {string} conversionData.email - Donor email
   * @param {string} conversionData.password - New password
   * @param {string} conversionData.firstName - Donor first name
   * @param {string} conversionData.lastName - Donor last name
   * @returns {Promise<Object>} Conversion response
   */
  async convertGuestToRegistered(organizationId, conversionData) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(conversionData, 'Conversion data');
    this.validateRequired(conversionData.email, 'Email');
    this.validateRequired(conversionData.password, 'Password');
    this.validateRequired(conversionData.firstName, 'First Name');
    this.validateRequired(conversionData.lastName, 'Last Name');
    this.validateEmail(conversionData.email);
    this.validateMinLength(conversionData.password, 6, 'Password');

    const response = await this.post(`/donor/${organizationId}/convert-guest`, conversionData);
    return response.success ? response.data : null;
  }

  // ===== DONOR PROFILE & DATA =====

  /**
   * Get donor profile
   * @returns {Promise<Object>} Donor profile data
   */
  async getDonorProfile() {
    const response = await this.get('/donor/profile');
    return response.success ? response.data : null;
  }

  /**
   * Update donor profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.firstName - Donor first name
   * @param {string} profileData.lastName - Donor last name
   * @returns {Promise<Object>} Updated profile
   */
  async updateDonorProfile(profileData) {
    this.validateRequired(profileData, 'Profile data');
    this.validateRequired(profileData.firstName, 'First Name');
    this.validateRequired(profileData.lastName, 'Last Name');

    const response = await this.put('/donor/profile', profileData);
    return response.success ? response.data : null;
  }

  /**
   * Get donor donations
   * @returns {Promise<Array>} Array of donor donations
   */
  async getDonorDonations() {
    const response = await this.get('/donor/donations');
    return response.success ? response.data : [];
  }

  /**
   * Record new donation
   * @param {Object} donationData - Donation data
   * @param {string} donationData.campaignId - Campaign ID
   * @param {number} donationData.amount - Donation amount
   * @returns {Promise<Object>} Recorded donation
   */
  async recordDonation(donationData) {
    this.validateRequired(donationData, 'Donation data');
    this.validateRequired(donationData.campaignId, 'Campaign ID');
    this.validateRequired(donationData.amount, 'Amount');
    this.validateNumber(donationData.amount, 'Amount');
    this.validateMin(donationData.amount, 0.01, 'Amount');

    const response = await this.post('/donor/donations', donationData);
    return response.success ? response.data : null;
  }

  // ===== DONOR PREFERENCES & SETTINGS =====

  /**
   * Get donor preferences
   * @returns {Promise<Object>} Donor preferences
   */
  async getDonorPreferences() {
    const response = await this.get('/donor/preferences');
    return response.success ? response.data : {};
  }

  /**
   * Update donor preference
   * @param {string} key - Preference key
   * @param {any} value - Preference value
   * @returns {Promise<Object>} Updated preference
   */
  async updateDonorPreference(key, value) {
    this.validateRequired(key, 'Preference Key');
    this.validateRequired(value, 'Preference Value');

    const response = await this.put('/donor/preferences', { key, value });
    return response.success ? response.data : null;
  }

  /**
   * Update multiple donor preferences
   * @param {Object} preferences - Object of preferences to update
   * @returns {Promise<Object>} Updated preferences
   */
  async updateDonorPreferences(preferences) {
    this.validateRequired(preferences, 'Preferences');
    this.validateObject(preferences, 'Preferences');

    const response = await this.put('/donor/preferences/bulk', preferences);
    return response.success ? response.data : null;
  }

  // ===== DONOR SUMMARY & ANALYTICS =====

  /**
   * Get donor summary
   * @returns {Promise<Object>} Donor summary data
   */
  async getDonorSummary() {
    const response = await this.get('/donor/summary');
    return response.success ? response.data : null;
  }

  /**
   * Get donor analytics for organization (admin only)
   * @param {string} organizationId - The organization ID
   * @returns {Promise<Object>} Donor analytics
   */
  async getDonorAnalytics(organizationId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const response = await this.get(`/donor/${organizationId}/admin/analytics`);
    return response.success ? response.data : null;
  }

  // ===== ADMIN DONOR MANAGEMENT =====

  /**
   * Get organization donors (admin only)
   * @param {string} organizationId - The organization ID
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of donors
   * @param {number} options.offset - Offset for pagination
   * @param {string} options.search - Search term
   * @param {string} options.status - Filter by status
   * @returns {Promise<Array>} Array of donors
   */
  async getOrganizationDonors(organizationId, options = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      limit = 50,
      offset = 0,
      search,
      status
    } = options;

    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 1000, 'Limit');
    this.validateNumber(offset, 'Offset');
    this.validateMin(offset, 0, 'Offset');

    const params = { limit, offset };
    if (search) params.search = search;
    if (status) params.status = status;

    const response = await this.get(`/donor/${organizationId}/admin/donors`, { params });
    return response.success ? response.data : [];
  }

  /**
   * Get donor by ID (admin only)
   * @param {string} organizationId - The organization ID
   * @param {string} donorId - The donor ID
   * @returns {Promise<Object>} Donor data
   */
  async getDonorById(organizationId, donorId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(donorId, 'Donor ID');
    this.validateId(donorId, 'Donor ID');

    const response = await this.get(`/donor/${organizationId}/admin/donors/${donorId}`);
    return response.success ? response.data : null;
  }

  /**
   * Update donor (admin only)
   * @param {string} organizationId - The organization ID
   * @param {string} donorId - The donor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated donor
   */
  async updateDonor(organizationId, donorId, updateData) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(donorId, 'Donor ID');
    this.validateId(donorId, 'Donor ID');
    this.validateRequired(updateData, 'Update data');

    const response = await this.put(`/donor/${organizationId}/admin/donors/${donorId}`, updateData);
    return response.success ? response.data : null;
  }

  /**
   * Deactivate donor (admin only)
   * @param {string} organizationId - The organization ID
   * @param {string} donorId - The donor ID
   * @returns {Promise<boolean>} Deactivation success
   */
  async deactivateDonor(organizationId, donorId) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(donorId, 'Donor ID');
    this.validateId(donorId, 'Donor ID');

    const response = await this.put(`/donor/${organizationId}/admin/donors/${donorId}/deactivate`);
    return response.success;
  }

  // ===== GUEST DONOR OPERATIONS =====

  /**
   * Check for existing guest donations by email
   * @param {string} organizationId - The organization ID
   * @param {string} email - Email to check
   * @returns {Promise<Object>} Guest donation check result
   */
  async checkGuestDonations(organizationId, email) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(email, 'Email');
    this.validateEmail(email);

    const response = await this.post(`/donor/${organizationId}/check-guest-donations`, {
      email
    });

    return response.success ? response.data : { hasGuestDonations: false, guestDonors: [] };
  }

  /**
   * Get guest donor by email
   * @param {string} organizationId - The organization ID
   * @param {string} email - Email to search for
   * @returns {Promise<Object>} Guest donor data
   */
  async getGuestDonorByEmail(organizationId, email) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(email, 'Email');
    this.validateEmail(email);

    const response = await this.get(`/donor/${organizationId}/guest-donors`, {
      params: { email }
    });

    return response.success ? response.data : null;
  }

  // ===== DONOR SEARCH & FILTERING =====

  /**
   * Search donors
   * @param {string} organizationId - The organization ID
   * @param {Object} searchOptions - Search options
   * @param {string} searchOptions.query - Search query
   * @param {string} searchOptions.type - Search type (name, email, etc.)
   * @param {number} searchOptions.limit - Maximum results
   * @returns {Promise<Array>} Search results
   */
  async searchDonors(organizationId, searchOptions = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      query = '',
      type = 'all',
      limit = 50
    } = searchOptions;

    this.validateString(query, 'Search Query');
    this.validateEnum(type, ['all', 'name', 'email', 'phone'], 'Search Type');
    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 1000, 'Limit');

    const response = await this.get(`/donor/${organizationId}/search`, {
      params: { query, type, limit }
    });

    return response.success ? response.data : [];
  }

  /**
   * Get donors by date range
   * @param {string} organizationId - The organization ID
   * @param {Object} dateOptions - Date options
   * @param {string} dateOptions.startDate - Start date
   * @param {string} dateOptions.endDate - End date
   * @param {number} dateOptions.limit - Maximum results
   * @returns {Promise<Array>} Donors in date range
   */
  async getDonorsByDateRange(organizationId, dateOptions = {}) {
    this.validateRequired(organizationId, 'Organization ID');
    this.validateId(organizationId, 'Organization ID');

    const {
      startDate,
      endDate,
      limit = 100
    } = dateOptions;

    if (startDate && endDate) {
      this.validateDate(startDate, 'Start Date');
      this.validateDate(endDate, 'End Date');
      this.validateDateRange(startDate, endDate);
    }

    this.validateNumber(limit, 'Limit');
    this.validateMin(limit, 1, 'Limit');
    this.validateMax(limit, 1000, 'Limit');

    const response = await this.get(`/donor/${organizationId}/date-range`, {
      params: { startDate, endDate, limit }
    });

    return response.success ? response.data : [];
  }

  // ===== VALIDATION HELPERS =====

  /**
   * Validate email format
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a string');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    return true;
  }

  /**
   * Validate date format
   */
  validateDate(dateString, fieldName) {
    if (!dateString || typeof dateString !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} must be a valid date`);
    }

    return true;
  }

  /**
   * Validate date range (start date must be before end date)
   */
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error('Start date must be before end date');
    }

    return true;
  }

  /**
   * Validate object
   */
  validateObject(value, fieldName) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${fieldName} must be an object`);
    }

    return true;
  }

  /**
   * Validate string
   */
  validateString(value, fieldName) {
    if (!value || typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }

    return true;
  }

  /**
   * Validate enum value
   */
  validateEnum(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
      throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }

    return true;
  }
}
