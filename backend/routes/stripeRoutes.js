import express from "express";
import {
  createConnectAccount,
  createAccountLink,
  getAccountStatus,
  createPaymentIntent,
  handleWebhook,
  getPublishableKey
} from "../controllers/stripe.js";
import { verifyToken, checkOrganizationAccess } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/webhook", handleWebhook); // Stripe webhooks
router.get("/publishable-key", getPublishableKey); // Frontend needs this

// Protected routes (require authentication)
router.use(verifyToken); // All routes below require authentication

// Stripe Connect account management
router.post("/connect/account/:organizationId", checkOrganizationAccess, createConnectAccount);
router.post("/connect/account-link/:organizationId", checkOrganizationAccess, createAccountLink);
router.get("/connect/status/:organizationId", checkOrganizationAccess, getAccountStatus);

// Payment processing
router.post("/payment-intent", createPaymentIntent);

export default router;
