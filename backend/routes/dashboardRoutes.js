import express from "express"
import {
  getDashboardSummary,
  getRecentDonations,
  getTopCampaigns,
  getOrganizationStatus,
  getDashboardNotifications
} from "../controllers/dashboard.js"

const router = express.Router()

// Get dashboard summary statistics
router.get("/summary/:id", getDashboardSummary)

// Get recent donations
router.get("/recent-donations/:id", getRecentDonations)

// Get top campaigns
router.get("/top-campaigns/:id", getTopCampaigns)

// Get organization status
router.get("/organization-status/:id", getOrganizationStatus)

// Get dashboard notifications
router.get("/notifications/:id", getDashboardNotifications)

export default router
