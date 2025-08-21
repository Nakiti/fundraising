import express from "express"
import { 
  registerDonor, 
  loginDonor, 
  logoutDonor, 
  getDonorProfile, 
  updateDonorProfile,
  getDonorDonations,
  getDonorSummary,
  recordDonation,
  getDonorPreferences,
  updateDonorPreferences,
  checkSession,
  getOrganizationDonors,
  getDonorAnalytics
} from "../controllers/donorController.js"
import { donorAuthMiddleware, optionalDonorAuthMiddleware } from "../middleware/donorAuth.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Public routes (no authentication required)
router.post("/:organizationId/register", registerDonor)
router.post("/:organizationId/login", loginDonor)
router.post("/logout", logoutDonor)
router.get("/session", checkSession)

// Protected donor routes (requires donor authentication)
router.get("/profile", donorAuthMiddleware, getDonorProfile)
router.put("/profile", donorAuthMiddleware, updateDonorProfile)
router.get("/donations", donorAuthMiddleware, getDonorDonations)
router.get("/summary", donorAuthMiddleware, getDonorSummary)
router.post("/donations", donorAuthMiddleware, recordDonation)
router.get("/preferences", donorAuthMiddleware, getDonorPreferences)
router.put("/preferences", donorAuthMiddleware, updateDonorPreferences)

// Admin routes (requires organization admin authentication)
router.get("/:organizationId/admin/donors", verifyToken, getOrganizationDonors)
router.get("/:organizationId/admin/analytics", verifyToken, getDonorAnalytics)

export default router