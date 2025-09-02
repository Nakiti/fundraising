import { BaseService } from '../base/BaseService.js';

/**
 * Stripe Service - Handles all Stripe-related operations for payment processing
 * Extends BaseService for common API operations and error handling
 */
export class StripeService extends BaseService {
  constructor() {
    super('StripeService');
  }

  // ===== STRIPE CONNECT =====

  /**
   * Create Stripe Connect account
   */
  async createConnectAccount(accountData) {
    this.validateRequired(accountData, 'Account data');
    this.validateRequired(accountData.organization_id, 'Organization ID');
    this.validateId(accountData.organization_id, 'Organization ID');
    this.validateRequired(accountData.email, 'Email');
    this.validateEmail(accountData.email, 'Email');

    return await this.post('/stripe/connect/create', accountData);
  }

  /**
   * Get Stripe Connect account
   */
  async getConnectAccount(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/connect/account/${organizationId}`);
  }

  /**
   * Update Stripe Connect account
   */
  async updateConnectAccount(organizationId, updateData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/stripe/connect/account/${organizationId}`, updateData);
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(organizationId, returnUrl, refreshUrl) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(returnUrl, 'Return URL');
    this.validateUrl(returnUrl, 'Return URL');
    this.validateRequired(refreshUrl, 'Refresh URL');
    this.validateUrl(refreshUrl, 'Refresh URL');

    return await this.post(`/stripe/connect/link/${organizationId}`, {
      return_url: returnUrl,
      refresh_url: refreshUrl
    });
  }

  /**
   * Get account link status
   */
  async getAccountLinkStatus(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/connect/link-status/${organizationId}`);
  }

  // ===== PAYMENT INTENTS =====

  /**
   * Create payment intent
   */
  async createPaymentIntent(paymentData) {
    this.validateRequired(paymentData, 'Payment data');
    this.validateRequired(paymentData.amount, 'Amount');
    this.validateCurrency(paymentData.amount, 'Amount');
    this.validateRequired(paymentData.campaign_id, 'Campaign ID');
    this.validateId(paymentData.campaign_id, 'Campaign ID');
    this.validateRequired(paymentData.currency, 'Currency');
    this.validateEnum(paymentData.currency, ['usd', 'cad', 'eur', 'gbp'], 'Currency');

    return await this.post('/stripe/payment-intent/create', paymentData);
  }

  /**
   * Get payment intent
   */
  async getPaymentIntent(paymentIntentId) {
    this.validateRequired(paymentIntentId, 'Payment Intent ID');
    return await this.get(`/stripe/payment-intent/${paymentIntentId}`);
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId, confirmationData) {
    this.validateRequired(paymentIntentId, 'Payment Intent ID');
    this.validateRequired(confirmationData, 'Confirmation data');

    return await this.post(`/stripe/payment-intent/${paymentIntentId}/confirm`, confirmationData);
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(paymentIntentId, cancellationData = {}) {
    this.validateRequired(paymentIntentId, 'Payment Intent ID');

    return await this.post(`/stripe/payment-intent/${paymentIntentId}/cancel`, cancellationData);
  }

  // ===== PAYMENT METHODS =====

  /**
   * Create payment method
   */
  async createPaymentMethod(paymentMethodData) {
    this.validateRequired(paymentMethodData, 'Payment method data');
    this.validateRequired(paymentMethodData.type, 'Payment method type');
    this.validateEnum(paymentMethodData.type, ['card', 'bank_account'], 'Payment method type');

    return await this.post('/stripe/payment-method/create', paymentMethodData);
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(paymentMethodId, customerId) {
    this.validateRequired(paymentMethodId, 'Payment method ID');
    this.validateRequired(customerId, 'Customer ID');

    return await this.post(`/stripe/payment-method/${paymentMethodId}/attach`, {
      customer: customerId
    });
  }

  /**
   * Detach payment method
   */
  async detachPaymentMethod(paymentMethodId) {
    this.validateRequired(paymentMethodId, 'Payment method ID');

    return await this.post(`/stripe/payment-method/${paymentMethodId}/detach`);
  }

  /**
   * Get customer payment methods
   */
  async getCustomerPaymentMethods(customerId) {
    this.validateRequired(customerId, 'Customer ID');
    return await this.get(`/stripe/customer/${customerId}/payment-methods`);
  }

  // ===== CUSTOMERS =====

  /**
   * Create customer
   */
  async createCustomer(customerData) {
    this.validateRequired(customerData, 'Customer data');
    this.validateRequired(customerData.email, 'Email');
    this.validateEmail(customerData.email, 'Email');

    return await this.post('/stripe/customer/create', customerData);
  }

  /**
   * Get customer
   */
  async getCustomer(customerId) {
    this.validateRequired(customerId, 'Customer ID');
    return await this.get(`/stripe/customer/${customerId}`);
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId, updateData) {
    this.validateRequired(customerId, 'Customer ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/stripe/customer/${customerId}`, updateData);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId) {
    this.validateRequired(customerId, 'Customer ID');
    return await this.delete(`/stripe/customer/${customerId}`);
  }

  // ===== SUBSCRIPTIONS =====

  /**
   * Create subscription
   */
  async createSubscription(subscriptionData) {
    this.validateRequired(subscriptionData, 'Subscription data');
    this.validateRequired(subscriptionData.customer_id, 'Customer ID');
    this.validateRequired(subscriptionData.price_id, 'Price ID');

    return await this.post('/stripe/subscription/create', subscriptionData);
  }

  /**
   * Get subscription
   */
  async getSubscription(subscriptionId) {
    this.validateRequired(subscriptionId, 'Subscription ID');
    return await this.get(`/stripe/subscription/${subscriptionId}`);
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId, updateData) {
    this.validateRequired(subscriptionId, 'Subscription ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/stripe/subscription/${subscriptionId}`, updateData);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, cancellationData = {}) {
    this.validateRequired(subscriptionId, 'Subscription ID');

    return await this.post(`/stripe/subscription/${subscriptionId}/cancel`, cancellationData);
  }

  // ===== WEBHOOKS =====

  /**
   * Process webhook event
   */
  async processWebhookEvent(webhookData, signature, secret) {
    this.validateRequired(webhookData, 'Webhook data');
    this.validateRequired(signature, 'Signature');
    this.validateRequired(secret, 'Secret');

    return await this.post('/stripe/webhook', {
      data: webhookData,
      signature,
      secret
    });
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(organizationId, filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    
    const params = { ...filters };
    return await this.getWithQuery(`/stripe/webhooks/${organizationId}`, params);
  }

  /**
   * Retry webhook event
   */
  async retryWebhookEvent(webhookEventId) {
    this.validateRequired(webhookEventId, 'Webhook event ID');

    return await this.post(`/stripe/webhook/${webhookEventId}/retry`);
  }

  // ===== REFUNDS =====

  /**
   * Create refund
   */
  async createRefund(refundData) {
    this.validateRequired(refundData, 'Refund data');
    this.validateRequired(refundData.payment_intent_id, 'Payment intent ID');
    this.validateRequired(refundData.amount, 'Amount');
    this.validateCurrency(refundData.amount, 'Amount');

    return await this.post('/stripe/refund/create', refundData);
  }

  /**
   * Get refund
   */
  async getRefund(refundId) {
    this.validateRequired(refundId, 'Refund ID');
    return await this.get(`/stripe/refund/${refundId}`);
  }

  /**
   * Update refund
   */
  async updateRefund(refundId, updateData) {
    this.validateRequired(refundId, 'Refund ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/stripe/refund/${refundId}`, updateData);
  }

  /**
   * Cancel refund
   */
  async cancelRefund(refundId) {
    this.validateRequired(refundId, 'Refund ID');

    return await this.post(`/stripe/refund/${refundId}/cancel`);
  }

  // ===== DISPUTES =====

  /**
   * Get dispute
   */
  async getDispute(disputeId) {
    this.validateRequired(disputeId, 'Dispute ID');
    return await this.get(`/stripe/dispute/${disputeId}`);
  }

  /**
   * Update dispute
   */
  async updateDispute(disputeId, updateData) {
    this.validateRequired(disputeId, 'Dispute ID');
    this.validateRequired(updateData, 'Update data');

    return await this.put(`/stripe/dispute/${disputeId}`, updateData);
  }

  /**
   * Accept dispute
   */
  async acceptDispute(disputeId) {
    this.validateRequired(disputeId, 'Dispute ID');

    return await this.post(`/stripe/dispute/${disputeId}/accept`);
  }

  /**
   * Contest dispute
   */
  async contestDispute(disputeId, contestData) {
    this.validateRequired(disputeId, 'Dispute ID');
    this.validateRequired(contestData, 'Contest data');

    return await this.post(`/stripe/dispute/${disputeId}/contest`, contestData);
  }

  // ===== STRIPE CONFIGURATION =====

  /**
   * Get Stripe configuration
   */
  async getStripeConfig(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/config/${organizationId}`);
  }

  /**
   * Update Stripe configuration
   */
  async updateStripeConfig(organizationId, configData) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(configData, 'Configuration data');

    return await this.put(`/stripe/config/${organizationId}`, configData);
  }

  /**
   * Get publishable key
   */
  async getPublishableKey(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/publishable-key/${organizationId}`);
  }

  // ===== STRIPE ANALYTICS =====

  /**
   * Get Stripe analytics
   */
  async getStripeAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/stripe/analytics/${organizationId}`, { range: dateRange });
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/stripe/payment-analytics/${organizationId}`, { range: dateRange });
  }

  /**
   * Get refund analytics
   */
  async getRefundAnalytics(organizationId, dateRange = '30d') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');

    return await this.getWithQuery(`/stripe/refund-analytics/${organizationId}`, { range: dateRange });
  }

  // ===== STRIPE VALIDATION =====

  /**
   * Validate Stripe account
   */
  async validateStripeAccount(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/validate/${organizationId}`);
  }

  /**
   * Check Stripe connectivity
   */
  async checkStripeConnectivity(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/stripe/connectivity/${organizationId}`);
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload, signature, secret) {
    this.validateRequired(payload, 'Payload');
    this.validateRequired(signature, 'Signature');
    this.validateRequired(secret, 'Secret');

    // This would typically use Stripe's webhook signature verification
    // For now, we'll just validate the parameters
    return true;
  }

  // ===== STRIPE EXPORT =====

  /**
   * Export Stripe data
   */
  async exportStripeData(organizationId, format = 'json', filters = {}) {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');
    
    const params = { format, ...filters };
    return await this.getWithQuery(`/stripe/export/${organizationId}`, params);
  }

  /**
   * Export Stripe analytics
   */
  async exportStripeAnalytics(organizationId, dateRange = '30d', format = 'json') {
    this.validateId(organizationId, 'Organization ID');
    this.validateEnum(dateRange, ['7d', '30d', '90d', '1y'], 'Date range');
    this.validateEnum(format, ['json', 'csv', 'pdf'], 'Export format');

    return await this.getWithQuery(`/stripe/exportAnalytics/${organizationId}`, {
      range: dateRange,
      format
    });
  }
}
