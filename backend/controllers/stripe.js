import { db } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { stripeService } from "../services/stripeService.js";
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound
} from "../utils/response.js";
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js";

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

  return new Promise((resolve, reject) => {
    // First, check if organization exists and doesn't already have a Stripe account
    const checkQuery = "SELECT id, name, stripe_account_id FROM organizations WHERE id = ?";
    
    db.query(checkQuery, [organizationId], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to check organization', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const organization = data[0];

      if (organization.stripe_account_id) {
        reject(new ValidationError('Organization already has a Stripe Connect account'));
        return;
      }

      try {
        // Create Stripe Connect account
        const stripeAccount = await stripeService.createConnectedAccount({
          id: organizationId,
          name: organization.name,
          email: email,
          country: country
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

        db.query(updateQuery, [stripeAccount.id, organizationId], (updateErr, updateData) => {
          if (updateErr) {
            reject(new DatabaseError('Failed to update organization with Stripe account', updateErr));
            return;
          }

          // Also create record in stripe_connect_accounts table
          const connectQuery = `
            INSERT INTO stripe_connect_accounts 
            (organization_id, stripe_account_id, account_type, country, email, is_active)
            VALUES (?, ?, ?, ?, ?, TRUE)
          `;

          db.query(connectQuery, [
            organizationId, 
            stripeAccount.id, 
            'standard', 
            country, 
            email
          ], (connectErr, connectData) => {
            if (connectErr) {
              console.error('Failed to create stripe_connect_accounts record:', connectErr);
              // Don't reject here as the main operation succeeded
            }

            sendCreated(res, {
              stripeAccountId: stripeAccount.id,
              accountStatus: 'pending',
              onboardingRequired: true
            }, 'Stripe Connect account created successfully');
            resolve();
          });
        });

      } catch (stripeError) {
        reject(new Error(`Stripe account creation failed: ${stripeError.message}`));
      }
    });
  });
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

  return new Promise((resolve, reject) => {
    const query = "SELECT stripe_account_id FROM organizations WHERE id = ?";
    
    db.query(query, [organizationId], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch organization', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const stripeAccountId = data[0].stripe_account_id;

      if (!stripeAccountId) {
        reject(new ValidationError('Organization does not have a Stripe Connect account'));
        return;
      }

      try {
        const accountLink = await stripeService.createAccountLink(
          stripeAccountId,
          refreshUrl,
          returnUrl
        );

        sendSuccess(res, {
          url: accountLink.url,
          expiresAt: accountLink.expires_at
        }, 'Account link created successfully');
        resolve();

      } catch (stripeError) {
        reject(new Error(`Account link creation failed: ${stripeError.message}`));
      }
    });
  });
});

/**
 * Get Stripe account status for organization
 */
export const getAccountStatus = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  return new Promise((resolve, reject) => {
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
    
    db.query(query, [organizationId], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch organization', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const orgData = data[0];

      if (!orgData.stripe_account_id) {
        sendSuccess(res, {
          hasStripeAccount: false,
          accountStatus: null,
          onboardingCompleted: false
        }, 'No Stripe account found');
        resolve();
        return;
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

        db.query(updateQuery, [
          accountStatus,
          stripeAccount.details_submitted && stripeAccount.charges_enabled,
          stripeAccount.details_submitted,
          stripeAccount.charges_enabled,
          stripeAccount.payouts_enabled,
          organizationId
        ], (updateErr) => {
          if (updateErr) {
            console.error('Failed to update Stripe account status:', updateErr);
          }

          sendSuccess(res, {
            hasStripeAccount: true,
            stripeAccountId: orgData.stripe_account_id,
            accountStatus: accountStatus,
            onboardingCompleted: stripeAccount.details_submitted && stripeAccount.charges_enabled,
            chargesEnabled: stripeAccount.charges_enabled,
            payoutsEnabled: stripeAccount.payouts_enabled,
            requirements: stripeAccount.requirements,
            businessProfile: stripeAccount.business_profile
          }, 'Stripe account status retrieved successfully');
          resolve();
        });

      } catch (stripeError) {
        reject(new Error(`Failed to retrieve Stripe account: ${stripeError.message}`));
      }
    });
  });
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

  return new Promise((resolve, reject) => {
    // Get organization's Stripe account
    const query = `
      SELECT stripe_account_id, stripe_charges_enabled 
      FROM organizations 
      WHERE id = ?
    `;
    
    db.query(query, [organizationId], async (err, data) => {
      if (err) {
        reject(new DatabaseError('Failed to fetch organization', err));
        return;
      }

      if (!data || data.length === 0) {
        reject(new NotFoundError('Organization'));
        return;
      }

      const org = data[0];

      if (!org.stripe_account_id) {
        reject(new ValidationError('Organization does not have Stripe payments set up. Please contact the organization administrator.'));
        return;
      }

      if (!org.stripe_charges_enabled) {
        reject(new ValidationError('Organization\'s Stripe account is not enabled for charges. Please contact the organization administrator.'));
        return;
      }

      try {
        const paymentIntent = await stripeService.createPaymentIntent({
          amount: amount,
          currency: currency,
          connectedAccountId: org.stripe_account_id,
          applicationFeeAmount: 0, // You can add platform fees here
          metadata: {
            ...metadata,
            campaign_id: campaignId.toString(),
            organization_id: organizationId.toString(),
            donor_email: donorEmail || '',
          }
        });

        sendCreated(res, {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: currency
        }, 'Payment intent created successfully');
        resolve();

      } catch (stripeError) {
        reject(new Error(`Payment intent creation failed: ${stripeError.message}`));
      }
    });
  });
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
    const event = await stripeService.handleWebhook(req.body, signature);

    // Log the webhook event
    const logQuery = `
      INSERT INTO stripe_webhook_events 
      (stripe_event_id, event_type, event_data, processed)
      VALUES (?, ?, ?, FALSE)
    `;

    db.query(logQuery, [
      event.id,
      event.type,
      JSON.stringify(event.data)
    ], (logErr) => {
      if (logErr) {
        console.error('Failed to log webhook event:', logErr);
      }
    });

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
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

    db.query(updateQuery, [event.id], (updateErr) => {
      if (updateErr) {
        console.error('Failed to mark webhook as processed:', updateErr);
      }
    });

    res.status(200).send('Webhook handled successfully');

  } catch (error) {
    console.error('Webhook handling failed:', error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
});

/**
 * Helper function to handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  const updateQuery = `
    UPDATE transactions 
    SET 
      status = 'completed',
      stripe_status = 'succeeded',
      stripe_charge_id = ?,
      processing_fee = ?,
      net_amount = ?
    WHERE stripe_payment_intent_id = ?
  `;

  // Calculate fees (Stripe's standard rate is 2.9% + 30¢)
  const amount = paymentIntent.amount / 100; // Convert from cents
  const processingFee = (amount * 0.029) + 0.30;
  const netAmount = amount - processingFee;

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [
      paymentIntent.latest_charge,
      processingFee.toFixed(2),
      netAmount.toFixed(2),
      paymentIntent.id
    ], (err, result) => {
      if (err) {
        console.error('Failed to update transaction after successful payment:', err);
        reject(err);
      } else {
        console.log(`Updated transaction for successful payment: ${paymentIntent.id}`);
        resolve(result);
      }
    });
  });
}

/**
 * Helper function to handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent) {
  const updateQuery = `
    UPDATE transactions 
    SET 
      status = 'failed',
      stripe_status = 'payment_failed',
      failure_reason = ?
    WHERE stripe_payment_intent_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [
      paymentIntent.last_payment_error?.message || 'Payment failed',
      paymentIntent.id
    ], (err, result) => {
      if (err) {
        console.error('Failed to update transaction after failed payment:', err);
        reject(err);
      } else {
        console.log(`Updated transaction for failed payment: ${paymentIntent.id}`);
        resolve(result);
      }
    });
  });
}

/**
 * Helper function to handle account updates
 */
async function handleAccountUpdated(account) {
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

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [
      accountStatus,
      account.details_submitted && account.charges_enabled,
      account.details_submitted,
      account.charges_enabled,
      account.payouts_enabled,
      account.id
    ], (err, result) => {
      if (err) {
        console.error('Failed to update organization after account update:', err);
        reject(err);
      } else {
        console.log(`Updated organization for account: ${account.id}`);
        resolve(result);
      }
    });
  });
}

/**
 * Get Stripe publishable key for frontend
 */
export const getPublishableKey = asyncHandler(async (req, res) => { 
  const publishableKey = stripeService.getPublishableKey();
  
  if (!publishableKey) {
    throw new ValidationError('Stripe publishable key is not configured');
  }

  sendSuccess(res, {
    publishableKey: publishableKey
  }, 'Publishable key retrieved successfully');
});
