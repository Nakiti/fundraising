import { api } from './apiClient.js';

/**
 * Guest Donor Service
 * Handles guest donor operations (donors without accounts)
 */
export class GuestDonorService {
  
  /**
   * Create or find a guest donor
   * @param {Object} donorData - Donor information
   * @param {string} donorData.organization_id - Organization ID
   * @param {string} donorData.email - Donor email
   * @param {string} donorData.first_name - Donor first name
   * @param {string} donorData.last_name - Donor last name
   * @param {string} [donorData.phone] - Donor phone number
   * @param {string} [donorData.address] - Donor address
   * @param {string} [donorData.city] - Donor city
   * @param {string} [donorData.zip_code] - Donor zip code
   * @returns {Promise<Object>} Donor data
   */
  static async createOrFindGuestDonor(donorData) {
    try {
      const response = await api.post('/guest-donor/create', donorData);
      return response.data;
    } catch (error) {
      console.error('Failed to create or find guest donor:', error);
      throw error;
    }
  }

  /**
   * Get a guest donor by ID
   * @param {string} donorId - Donor ID
   * @returns {Promise<Object>} Donor data
   */
  static async getGuestDonor(donorId) {
    try {
      const response = await api.get(`/guest-donor/get/${donorId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get guest donor:', error);
      throw error;
    }
  }

  /**
   * Update a guest donor
   * @param {string} donorId - Donor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated donor data
   */
  static async updateGuestDonor(donorId, updateData) {
    try {
      const response = await api.put(`/guest-donor/update/${donorId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update guest donor:', error);
      throw error;
    }
  }

  /**
   * Get all guest donors for an organization
   * @param {string} organizationId - Organization ID
   * @returns {Promise<Array>} Array of guest donors
   */
  static async getGuestDonorsByOrganization(organizationId) {
    try {
      const response = await api.get(`/guest-donor/getByOrg/${organizationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get guest donors by organization:', error);
      throw error;
    }
  }
}

export default GuestDonorService;
