import { asyncHandler } from "../middleware/errorHandler.js";
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js";
import { ValidationError } from "../utils/errors.js";
import { getStripeService } from "../services/ServiceRegistry.js";

// Initialize service
const stripeService = getStripeService();

/**
 * Create Stripe Connect account for organization
 */
export const createConnectAccount = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, country = 'US' } = req.body;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  if (!email) {
    throw new ValidationError('Email is required for Stripe Connect account');
  }

  try {
    // Delegate to StripeService
    const accountData = await stripeService.createConnectAccount({
      organizationId: parseInt(organizationId),
      email,
      country
    });
    
    sendCreated(res, {
      stripeAccountId: accountData.stripeAccountId,
      accountStatus: accountData.accountStatus,
      onboardingRequired: accountData.onboardingRequired
    }, 'Stripe Connect account created successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});

/**
 * Create account link for Stripe Connect onboarding
 */
export const createAccountLink = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { refreshUrl, returnUrl } = req.body;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  if (!refreshUrl || !returnUrl) {
    throw new ValidationError('Both refresh URL and return URL are required');
  }

  try {
    // Delegate to StripeService
    const accountLink = await stripeService.createAccountLink(
      parseInt(organizationId),
      refreshUrl,
      returnUrl
    );

    sendSuccess(res, {
      url: accountLink.url,
      expiresAt: accountLink.expiresAt
    }, 'Account link created successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});

/**
 * Get Stripe account status for organization
 */
export const getAccountStatus = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  try {
    // Delegate to StripeService
    const accountStatus = await stripeService.getAccountStatus(parseInt(organizationId));
    
    sendSuccess(res, accountStatus, 'Stripe account status retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else {
      throw error;
    }
  }
});

/**
 * Create payment intent for donation
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { 
    amount, 
    currency = 'usd',
    campaignId,
    organizationId,
    donorEmail,
    metadata = {} 
  } = req.body;

  if (!amount || amount <= 0) {
    throw new ValidationError('Valid amount is required');
  }

  if (!campaignId || !organizationId) {
    throw new ValidationError('Campaign ID and Organization ID are required');
  }

  try {
    // Delegate to StripeService
    const paymentIntent = await stripeService.createPaymentIntent({
      amount,
      currency,
      campaignId,
      organizationId,
      donorEmail,
      metadata
    });

    sendCreated(res, {
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    }, 'Payment intent created successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});

/**
 * Handle Stripe webhooks
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    throw new ValidationError('Missing Stripe signature');
  }

  try {
    // Delegate to StripeService
    await stripeService.handleWebhook(req.body, signature);
    
    res.status(200).send('Webhook handled successfully');
  } catch (error) {
    console.error('Webhook handling failed:', error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
});

/**
 * Get Stripe publishable key for frontend
 */
export const getPublishableKey = asyncHandler(async (req, res) => { 
  try {
    // Delegate to StripeService
    const publishableKey = stripeService.getPublishableKey();
    
    sendSuccess(res, {
      publishableKey: publishableKey
    }, 'Publishable key retrieved successfully');
  } catch (error) {
    if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});

/**
 * Additional endpoint for getting organization's Stripe account details
 */
export const getOrganizationStripeAccount = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  try {
    // Delegate to StripeService
    const accountDetails = await stripeService.getOrganizationStripeAccount(parseInt(organizationId));
    
    sendSuccess(res, accountDetails, 'Organization Stripe account details retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'Organization not found');
    } else {
      throw error;
    }
  }
});

/**
 * Additional endpoint for getting webhook events
 */
export const getWebhookEvents = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { limit = 50 } = req.query;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  try {
    // Delegate to StripeService
    const events = await stripeService.getWebhookEvents(parseInt(organizationId), parseInt(limit));
    
    sendSuccess(res, { events }, 'Webhook events retrieved successfully');
  } catch (error) {
    if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});

/**
 * Additional endpoint for getting Stripe account statistics
 */
export const getStripeAccountStats = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  try {
    // Delegate to StripeService
    const stats = await stripeService.getStripeAccountStats(parseInt(organizationId));
    
    sendSuccess(res, stats, 'Stripe account statistics retrieved successfully');
  } catch (error) {
    if (error.name === 'ValidationError') {
      sendNotFound(res, error.message);
    } else {
      throw error;
    }
  }
});
