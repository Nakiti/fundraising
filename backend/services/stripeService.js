import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError,
  AuthenticationError
} from '../utils/errors.js';
import { stripeService } from './stripeSDKService.js';

/**
 * Stripe Service - Handles Stripe Connect and payment operations
 * Manages Stripe Connect accounts, payment processing, and webhook handling
 */
export class StripeService extends BaseService {
  constructor() {
    super('organizations'); // Base table for Stripe operations
  }

  /**
   * Valid Stripe account statuses
   */
  static VALID_ACCOUNT_STATUSES = ['pending', 'restricted', 'enabled', 'disabled'];

  /**
   * Valid account types
   */
  static VALID_ACCOUNT_TYPES = ['standard', 'express', 'custom'];

  /**
   * Supported currencies
   */
  static SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'];

  /**
   * Validate Stripe account data
   * @param {Object} accountData - Account data to validate
   */
  validateAccountData(accountData) {
    if (!accountData.organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!accountData.email) {
      throw new ValidationError('Email is required for Stripe Connect account');
    }

    if (!accountData.email.includes('@')) {
      throw new ValidationError('Valid email format is required');
    }

    if (accountData.country && accountData.country.length !== 2) {
      throw new ValidationError('Country must be a 2-letter ISO code');
    }

    if (accountData.accountType && !StripeService.VALID_ACCOUNT_TYPES.includes(accountData.accountType)) {
      throw new ValidationError(`Account type must be one of: ${StripeService.VALID_ACCOUNT_TYPES.join(', ')}`);
    }
  }

  /**
   * Validate payment intent data
   * @param {Object} paymentData - Payment data to validate
   */
  validatePaymentData(paymentData) {
    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new ValidationError('Valid amount is required');
    }

    if (!paymentData.campaignId) {
      throw new ValidationError('Campaign ID is required');
    }

    if (!paymentData.organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (paymentData.currency && !StripeService.SUPPORTED_CURRENCIES.includes(paymentData.currency.toLowerCase())) {
      throw new ValidationError(`Currency must be one of: ${StripeService.SUPPORTED_CURRENCIES.join(', ')}`);
    }

    if (paymentData.amount > 1000000) {
      throw new ValidationError('Amount cannot exceed $1,000,000');
    }
  }

  /**
   * Check if organization already has Stripe account
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object|null>} Organization data or null
   */
  async checkExistingStripeAccount(organizationId) {
    const query = "SELECT id, name, stripe_account_id FROM organizations WHERE id = ?";
    const results = await this.executeQuery(query, [organizationId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    const organization = results[0];
    
    if (organization.stripe_account_id) {
      throw new ValidationError('Organization already has a Stripe Connect account');
    }

    return organization;
  }

  /**
   * Create Stripe Connect account for organization
   * @param {Object} accountData - Account creation data
   * @returns {Promise<Object>} Created account data
   */
  async createConnectAccount(accountData) {
    // Validate input data
    this.validateAccountData(accountData);

    // Check if organization exists and doesn't have Stripe account
    const organization = await this.checkExistingStripeAccount(accountData.organizationId);

    try {
      // Create Stripe Connect account
      const stripeAccount = await stripeService.createConnectedAccount({
        id: accountData.organizationId,
        name: organization.name,
        email: accountData.email,
        country: accountData.country || 'US'
      });

      // Update organization with Stripe account info
      const updateQuery = `
        UPDATE organizations 
        SET stripe_account_id = ?, 
            stripe_account_status = 'pending',
            stripe_onboarding_completed = FALSE,
            updated_at = NOW()
        WHERE id = ?
      `;

      await this.executeQuery(updateQuery, [stripeAccount.id, accountData.organizationId]);

      // Create record in stripe_connect_accounts table
      const connectQuery = `
        INSERT INTO stripe_connect_accounts 
        (organization_id, stripe_account_id, account_type, country, email, is_active)
        VALUES (?, ?, ?, ?, ?, TRUE)
      `;

      try {
        await this.executeQuery(connectQuery, [
          accountData.organizationId, 
          stripeAccount.id, 
          accountData.accountType || 'standard', 
          accountData.country || 'US', 
          accountData.email
        ]);
      } catch (error) {
        console.error('Failed to create stripe_connect_accounts record:', error);
        // Don't fail the main operation as the Stripe account was created successfully
      }

      return {
        stripeAccountId: stripeAccount.id,
        accountStatus: 'pending',
        onboardingRequired: true,
        organizationId: accountData.organizationId
      };

    } catch (stripeError) {
      throw new Error(`Stripe account creation failed: ${stripeError.message}`);
    }
  }

  /**
   * Create account link for Stripe Connect onboarding
   * @param {number} organizationId - Organization ID
   * @param {string} refreshUrl - Refresh URL for onboarding
   * @param {string} returnUrl - Return URL for onboarding
   * @returns {Promise<Object>} Account link data
   */
  async createAccountLink(organizationId, refreshUrl, returnUrl) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    if (!refreshUrl || !returnUrl) {
      throw new ValidationError('Both refresh URL and return URL are required');
    }

    // Get organization's Stripe account ID
    const query = "SELECT stripe_account_id FROM organizations WHERE id = ?";
    const results = await this.executeQuery(query, [organizationId]);

    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    const stripeAccountId = results[0].stripe_account_id;

    if (!stripeAccountId) {
      throw new ValidationError('Organization does not have a Stripe Connect account');
    }

    try {
      const accountLink = await stripeService.createAccountLink(
        stripeAccountId,
        refreshUrl,
        returnUrl
      );

      return {
        url: accountLink.url,
        expiresAt: accountLink.expires_at,
        stripeAccountId: stripeAccountId
      };

    } catch (stripeError) {
      throw new Error(`Account link creation failed: ${stripeError.message}`);
    }
  }

  /**
   * Get Stripe account status for organization
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Account status data
   */
  async getAccountStatus(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        stripe_account_id,
        stripe_account_status,
        stripe_onboarding_completed,
        stripe_details_submitted,
        stripe_charges_enabled,
        stripe_payouts_enabled
      FROM organizations 
      WHERE id = ?
    `;
    
    const results = await this.executeQuery(query, [organizationId]);

    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    const orgData = results[0];

    if (!orgData.stripe_account_id) {
      return {
        hasStripeAccount: false,
        accountStatus: null,
        onboardingCompleted: false
      };
    }

    try {
      // Get fresh data from Stripe
      const stripeAccount = await stripeService.retrieveAccount(orgData.stripe_account_id);

      // Update our database with fresh Stripe data
      const updateQuery = `
        UPDATE organizations 
        SET 
          stripe_account_status = ?,
          stripe_onboarding_completed = ?,
          stripe_details_submitted = ?,
          stripe_charges_enabled = ?,
          stripe_payouts_enabled = ?,
          updated_at = NOW()
        WHERE id = ?
      `;

      const accountStatus = stripeAccount.charges_enabled ? 'enabled' : 
                          stripeAccount.details_submitted ? 'restricted' : 'pending';

      await this.executeQuery(updateQuery, [
        accountStatus,
        stripeAccount.details_submitted && stripeAccount.charges_enabled,
        stripeAccount.details_submitted,
        stripeAccount.charges_enabled,
        stripeAccount.payouts_enabled,
        organizationId
      ]);

      // Update organization status after Stripe status update
      try {
        const { getOrganizationStatusService } = await import('./ServiceRegistry.js');
        const orgStatusService = getOrganizationStatusService();
        await orgStatusService.checkAndUpdateOrganizationStatus(organizationId);
      } catch (statusError) {
        console.error('Failed to update organization status after Stripe update:', statusError);
        // Don't fail the main operation, just log the error
      }

      return {
        hasStripeAccount: true,
        stripeAccountId: orgData.stripe_account_id,
        accountStatus: accountStatus,
        onboardingCompleted: stripeAccount.details_submitted && stripeAccount.charges_enabled,
        chargesEnabled: stripeAccount.charges_enabled,
        payoutsEnabled: stripeAccount.payouts_enabled,
        requirements: stripeAccount.requirements,
        businessProfile: stripeAccount.business_profile
      };

    } catch (stripeError) {
      throw new Error(`Failed to retrieve Stripe account: ${stripeError.message}`);
    }
  }

  /**
   * Create payment intent for donation
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment intent data
   */
  async createPaymentIntent(paymentData) {
    // Validate input data
    this.validatePaymentData(paymentData);

    // Get organization's Stripe account
    const query = `
      SELECT stripe_account_id, stripe_charges_enabled 
      FROM organizations 
      WHERE id = ?
    `;
    
    const results = await this.executeQuery(query, [paymentData.organizationId]);

    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    const org = results[0];

    if (!org.stripe_account_id) {
      throw new ValidationError('Organization does not have Stripe payments set up. Please contact the organization administrator.');
    }

    if (!org.stripe_charges_enabled) {
      throw new ValidationError('Organization\'s Stripe account is not enabled for charges. Please contact the organization administrator.');
    }

    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        connectedAccountId: org.stripe_account_id,
        applicationFeeAmount: paymentData.applicationFeeAmount || 0,
        metadata: {
          ...paymentData.metadata,
          campaign_id: paymentData.campaignId.toString(),
          organization_id: paymentData.organizationId.toString(),
          donor_email: paymentData.donorEmail || '',
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd'
      };

    } catch (stripeError) {
      throw new Error(`Payment intent creation failed: ${stripeError.message}`);
    }
  }

  /**
   * Handle Stripe webhook events
   * @param {Object} eventBody - Webhook event body
   * @param {string} signature - Stripe signature
   * @returns {Promise<Object>} Processed event data
   */
  async handleWebhook(eventBody, signature) {
    if (!signature) {
      throw new ValidationError('Missing Stripe signature');
    }

    try {
      const event = await stripeService.handleWebhook(eventBody, signature);

      // Log the webhook event
      const logQuery = `
        INSERT INTO stripe_webhook_events 
        (stripe_event_id, event_type, event_data, processed)
        VALUES (?, ?, ?, FALSE)
      `;

      await this.executeQuery(logQuery, [
        event.id,
        event.type,
        JSON.stringify(event.data)
      ]);

      // Handle specific event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;
        case 'account.updated':
          await this.handleAccountUpdated(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark webhook as processed
      const updateQuery = `
        UPDATE stripe_webhook_events 
        SET processed = TRUE, processed_at = NOW() 
        WHERE stripe_event_id = ?
      `;

      await this.executeQuery(updateQuery, [event.id]);

      return event;

    } catch (error) {
      console.error('Webhook handling failed:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment intent
   * @param {Object} paymentIntent - Stripe payment intent object
   * @returns {Promise<Object>} Update result
   */
  async handlePaymentIntentSucceeded(paymentIntent) {
    // First, get the campaign_id from the transaction
    const getTransactionQuery = `
      SELECT campaign_id FROM transactions 
      WHERE stripe_payment_intent_id = ?
    `;

    const transactionResults = await this.executeQuery(getTransactionQuery, [paymentIntent.id]);

    if (!transactionResults || transactionResults.length === 0) {
      console.error('No transaction found for payment intent:', paymentIntent.id);
      throw new Error('Transaction not found');
    }

    const campaignId = transactionResults[0].campaign_id;

    // Calculate fees (Stripe's standard rate is 2.9% + 30¢)
    const amount = paymentIntent.amount / 100; // Convert from cents
    const processingFee = (amount * 0.029) + 0.30;
    const netAmount = amount - processingFee;

    // Update transaction
    const updateTransactionQuery = `
      UPDATE transactions 
      SET 
        status = 'completed',
        stripe_status = 'succeeded',
        stripe_charge_id = ?,
        processing_fee = ?,
        net_amount = ?
      WHERE stripe_payment_intent_id = ?
    `;

    await this.executeQuery(updateTransactionQuery, [
      paymentIntent.latest_charge,
      processingFee.toFixed(2),
      netAmount.toFixed(2),
      paymentIntent.id
    ]);

    // Update campaign_details donations count
    const updateCampaignQuery = `
      UPDATE campaign_details 
      SET 
        donations = COALESCE(donations, 0) + 1,
        raised = COALESCE(raised, 0) + ?,
        updated_at = NOW()
      WHERE campaign_id = ?
    `;

    try {
      await this.executeQuery(updateCampaignQuery, [amount, campaignId]);
      console.log(`Updated campaign donations count for campaign: ${campaignId}`);
    } catch (error) {
      console.error('Failed to update campaign donations count:', error);
      // Don't fail the main operation as the transaction update succeeded
    }

    console.log(`Updated transaction for successful payment: ${paymentIntent.id}`);
    return { success: true, campaignId, amount };
  }

  /**
   * Handle failed payment intent
   * @param {Object} paymentIntent - Stripe payment intent object
   * @returns {Promise<Object>} Update result
   */
  async handlePaymentIntentFailed(paymentIntent) {
    const updateQuery = `
      UPDATE transactions 
      SET 
        status = 'failed',
        stripe_status = 'payment_failed',
        failure_reason = ?
      WHERE stripe_payment_intent_id = ?
    `;

    const result = await this.executeQuery(updateQuery, [
      paymentIntent.last_payment_error?.message || 'Payment failed',
      paymentIntent.id
    ]);

    console.log(`Updated transaction for failed payment: ${paymentIntent.id}`);
    return result;
  }

  /**
   * Handle account updates
   * @param {Object} account - Stripe account object
   * @returns {Promise<Object>} Update result
   */
  async handleAccountUpdated(account) {
    const updateQuery = `
      UPDATE organizations 
      SET 
        stripe_account_status = ?,
        stripe_onboarding_completed = ?,
        stripe_details_submitted = ?,
        stripe_charges_enabled = ?,
        stripe_payouts_enabled = ?,
        updated_at = NOW()
      WHERE stripe_account_id = ?
    `;

    const accountStatus = account.charges_enabled ? 'enabled' : 
                        account.details_submitted ? 'restricted' : 'pending';

    const result = await this.executeQuery(updateQuery, [
      accountStatus,
      account.details_submitted && account.charges_enabled,
      account.details_submitted,
      account.charges_enabled,
      account.payouts_enabled,
      account.id
    ]);

    console.log(`Updated organization for account: ${account.id}`);
    return result;
  }

  /**
   * Get Stripe publishable key
   * @returns {string} Publishable key
   */
  getPublishableKey() {
    const publishableKey = stripeService.getPublishableKey();
    
    if (!publishableKey) {
      throw new ValidationError('Stripe publishable key is not configured');
    }

    return publishableKey;
  }

  /**
   * Get organization's Stripe account details
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Stripe account details
   */
  async getOrganizationStripeAccount(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        stripe_account_id,
        stripe_account_status,
        stripe_onboarding_completed,
        stripe_details_submitted,
        stripe_charges_enabled,
        stripe_payouts_enabled,
        created_at,
        updated_at
      FROM organizations 
      WHERE id = ?
    `;

    const results = await this.executeQuery(query, [organizationId]);

    if (!results || results.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return results[0];
  }

  /**
   * Get Stripe webhook events for organization
   * @param {number} organizationId - Organization ID
   * @param {number} limit - Number of events to return
   * @returns {Promise<Array>} Array of webhook events
   */
  async getWebhookEvents(organizationId, limit = 50) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        stripe_event_id,
        event_type,
        event_data,
        processed,
        created_at,
        processed_at
      FROM stripe_webhook_events
      WHERE event_data LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const results = await this.executeQuery(query, [`%"organization_id":"${organizationId}"%`, limit]);
    return results || [];
  }

  /**
   * Get Stripe account statistics
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Account statistics
   */
  async getStripeAccountStats(organizationId) {
    if (!organizationId) {
      throw new ValidationError('Organization ID is required');
    }

    const query = `
      SELECT 
        COUNT(CASE WHEN stripe_account_status = 'enabled' THEN 1 END) as enabled_accounts,
        COUNT(CASE WHEN stripe_account_status = 'pending' THEN 1 END) as pending_accounts,
        COUNT(CASE WHEN stripe_account_status = 'restricted' THEN 1 END) as restricted_accounts,
        COUNT(CASE WHEN stripe_onboarding_completed = TRUE THEN 1 END) as completed_onboarding,
        COUNT(CASE WHEN stripe_charges_enabled = TRUE THEN 1 END) as charges_enabled,
        COUNT(CASE WHEN stripe_payouts_enabled = TRUE THEN 1 END) as payouts_enabled
      FROM organizations
      WHERE id = ?
    `;

    const results = await this.executeQuery(query, [organizationId]);
    const stats = results[0] || {};

    return {
      enabled_accounts: parseInt(stats.enabled_accounts) || 0,
      pending_accounts: parseInt(stats.pending_accounts) || 0,
      restricted_accounts: parseInt(stats.restricted_accounts) || 0,
      completed_onboarding: parseInt(stats.completed_onboarding) || 0,
      charges_enabled: parseInt(stats.charges_enabled) || 0,
      payouts_enabled: parseInt(stats.payouts_enabled) || 0
    };
  }
}
