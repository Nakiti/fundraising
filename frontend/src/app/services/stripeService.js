import { api } from './apiClient';

/**
 * Stripe-related API calls
 */
export class StripeService {
  
  /**
   * Get Stripe publishable key
   */
  static async getPublishableKey() {
    try {
      const response = await api.get('/stripe/publishable-key');
      return response.data.publishableKey;
    } catch (error) {
      console.error('Failed to get Stripe publishable key:', error);
      throw error;
    }
  }

  /**
   * Create Stripe Connect account for organization
   */
  static async createConnectAccount(organizationId, email, country = 'US') {
    try {
      const response = await api.post(`/stripe/connect/account/${organizationId}`, {
        email,
        country
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create Stripe Connect account:', error);
      throw error;
    }
  }

  /**
   * Create account link for Stripe onboarding
   */
  static async createAccountLink(organizationId, refreshUrl, returnUrl) {
    try {
      const response = await api.post(`/stripe/connect/account-link/${organizationId}`, {
        refreshUrl,
        returnUrl
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create account link:', error);
      throw error;
    }
  }

  /**
   * Get Stripe account status for organization
   */
  static async getAccountStatus(organizationId) {
    try {
      const response = await api.get(`/stripe/connect/status/${organizationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get account status:', error);
      throw error;
    }
  }

  /**
   * Create payment intent for donation
   */
  static async createPaymentIntent(paymentData) {
    try {
      const response = await api.post('/stripe/payment-intent', paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Create transaction record after successful payment
   */
  static async createTransaction(transactionData) {
    try {
      const response = await api.post('/transaction/create', transactionData);
      return response.data;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  }
}

/**
 * Frontend Stripe utilities
 */
export class StripeUtils {
  
  /**
   * Format amount for Stripe (convert to cents)
   */
  static formatAmountForStripe(amount) {
    return Math.round(amount * 100);
  }

  /**
   * Format amount for display (convert from cents)
   */
  static formatAmountForDisplay(amountInCents) {
    return (amountInCents / 100).toFixed(2);
  }

  /**
   * Validate donation amount
   */
  static validateDonationAmount(amount) {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid donation amount');
    }
    
    if (numAmount < 1) {
      throw new Error('Minimum donation amount is $1.00');
    }
    
    if (numAmount > 999999) {
      throw new Error('Maximum donation amount is $999,999.00');
    }
    
    return numAmount;
  }

  /**
   * Get payment method icon
   */
  static getPaymentMethodIcon(type) {
    switch (type) {
      case 'card':
        return '💳';
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return '🔵';
      default:
        return '💳';
    }
  }

  /**
   * Format error message for user display
   */
  static formatStripeError(error) {
    if (!error) return 'An unknown error occurred';
    
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect.';
      case 'insufficient_funds':
        return 'Your card has insufficient funds.';
      case 'processing_error':
        return 'An error occurred while processing your payment. Please try again.';
      case 'authentication_required':
        return 'Your bank requires additional authentication. Please try again.';
      default:
        return error.message || 'An error occurred while processing your payment.';
    }
  }

  /**
   * Calculate processing fee (Stripe's standard rate)
   */
  static calculateProcessingFee(amount) {
    return (amount * 0.029) + 0.30;
  }

  /**
   * Calculate net amount after fees
   */
  static calculateNetAmount(amount) {
    const fee = this.calculateProcessingFee(amount);
    return Math.max(0, amount - fee);
  }
}

export default StripeService;
