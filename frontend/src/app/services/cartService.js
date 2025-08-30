import { apiClient } from './apiClient';

export const CartService = {
  /**
   * Get organization designations (funds that apply to any campaign)
   */
  async getOrganizationDesignations(organizationId) {
    try {
      const response = await apiClient.get(`/api/organizations/${organizationId}/designations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization designations:', error);
      throw error;
    }
  },

  /**
   * Validate cart items before checkout
   * Checks if campaigns are still active, amounts are valid, etc.
   */
  async validateCartItems(cartItems) {
    try {
      const response = await apiClient.post('/api/cart/validate', {
        items: cartItems.map(item => ({
          campaignId: item.campaignId,
          amount: item.amount,
          designationId: item.selectedDesignation
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error validating cart items:', error);
      throw error;
    }
  },

  /**
   * Create multiple transactions for cart checkout
   */
  async createCartTransactions(cartData, donorData, paymentData) {
    try {
      const response = await apiClient.post('/api/cart/checkout', {
        items: cartData.items.map(item => ({
          campaign_id: item.campaignId,
          amount: item.amount,
          designation_id: item.selectedDesignation,
          custom_responses: item.customResponses
        })),
        donor: donorData,
        payment: paymentData,
        organization_id: cartData.organizationId,
        total_amount: cartData.totalAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error creating cart transactions:', error);
      throw error;
    }
  },

  /**
   * Get cart recommendations based on current items
   */
  async getCartRecommendations(organizationId, currentCampaignIds) {
    try {
      const response = await apiClient.post(`/api/organizations/${organizationId}/recommendations`, {
        currentCampaigns: currentCampaignIds
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart recommendations:', error);
      return []; // Return empty array if recommendations fail
    }
  },

  /**
   * Save cart for logged-in users (future feature)
   */
  async saveCart(userId, cartData) {
    try {
      const response = await apiClient.post(`/api/users/${userId}/cart`, cartData);
      return response.data;
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  },

  /**
   * Load saved cart for logged-in users (future feature)
   */
  async loadSavedCart(userId) {
    try {
      const response = await apiClient.get(`/api/users/${userId}/cart`);
      return response.data;
    } catch (error) {
      console.error('Error loading saved cart:', error);
      return null;
    }
  }
};

