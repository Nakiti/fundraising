import Stripe from 'stripe';
import { config } from '../config.js';
import { DatabaseError, ValidationError } from '../utils/errors.js';

class StripeService {
  constructor() {
    if (!config.stripe.secretKey) {
      console.warn('Stripe secret key not configured. Stripe functionality will be limited.');
      this.stripe = null;
      return;
    }
    
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  /**
   * Check if Stripe is properly configured
   */
  isConfigured() {
    return this.stripe !== null;
  }

  /**
   * Create a Stripe Connect account for an organization
   * @param {Object} organizationData - Organization information
   * @returns {Object} Stripe account object
   */
  async createConnectedAccount(organizationData) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    try {
      const account = await this.stripe.accounts.create({
        type: 'standard',
        country: organizationData.country || 'US',
        email: organizationData.email,
        metadata: {
          organization_id: organizationData.id.toString(),
          organization_name: organizationData.name || '',
        },
      });

      console.log(`Created Stripe Connect account ${account.id} for organization ${organizationData.id}`);
      return account;
    } catch (error) {
      console.error('Stripe Connect account creation failed:', error);
      throw new Error(`Failed to create Stripe Connect account: ${error.message}`);
    }
  }

  /**
   * Create an account link for Stripe Connect onboarding
   * @param {string} accountId - Stripe account ID
   * @param {string} refreshUrl - URL to redirect to if onboarding needs to be restarted
   * @param {string} returnUrl - URL to redirect to after successful onboarding
   * @returns {Object} Account link object
   */
  async createAccountLink(accountId, refreshUrl, returnUrl) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink;
    } catch (error) {
      console.error('Stripe account link creation failed:', error);
      throw new Error(`Failed to create account link: ${error.message}`);
    }
  }

  /**
   * Retrieve a Stripe Connect account
   * @param {string} accountId - Stripe account ID
   * @returns {Object} Stripe account object
   */
  async retrieveAccount(accountId) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    try {
      return await this.stripe.accounts.retrieve(accountId);
    } catch (error) {
      console.error('Stripe account retrieval failed:', error);
      throw new Error(`Failed to retrieve account: ${error.message}`);
    }
  }

  /**
   * Create a payment intent for a donation
   * @param {Object} paymentData - Payment information
   * @returns {Object} Payment intent object
   */
  async createPaymentIntent(paymentData) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    const {
      amount,
      currency = 'usd',
      connectedAccountId,
      applicationFeeAmount,
      metadata = {}
    } = paymentData;

    // Validate required fields
    if (!amount || amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    try {
      const paymentIntentData = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          platform: 'fundraising-platform',
          created_at: new Date().toISOString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      // If this is for a connected account, set transfer data
      if (connectedAccountId) {
        paymentIntentData.transfer_data = {
          destination: connectedAccountId,
        };

        // Set application fee if specified
        if (applicationFeeAmount && applicationFeeAmount > 0) {
          paymentIntentData.application_fee_amount = Math.round(applicationFeeAmount * 100);
        }
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);
      
      console.log(`Created payment intent ${paymentIntent.id} for amount $${amount}`);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Object} Payment intent object
   */
  async retrievePaymentIntent(paymentIntentId) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Stripe payment intent retrieval failed:', error);
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  /**
   * Handle Stripe webhook events
   * @param {string} body - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Stripe event object
   */
  async handleWebhook(body, signature) {
    if (!this.isConfigured() || !config.stripe.webhookSecret) {
      throw new Error('Stripe webhook configuration is missing');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe.webhookSecret
      );

      console.log(`Received Stripe webhook: ${event.type}`);
      return event;
    } catch (error) {
      console.error('Stripe webhook verification failed:', error);
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  /**
   * Create a Stripe customer
   * @param {Object} customerData - Customer information
   * @returns {Object} Stripe customer object
   */
  async createCustomer(customerData) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    const { email, name, metadata = {} } = customerData;

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          platform: 'fundraising-platform',
        },
      });

      console.log(`Created Stripe customer ${customer.id} for ${email}`);
      return customer;
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Get the publishable key for frontend use
   * @returns {string} Stripe publishable key
   */
  getPublishableKey() {
    return config.stripe.publishableKey || '';
  }
}

// Export singleton instance
export const stripeService = new StripeService();
