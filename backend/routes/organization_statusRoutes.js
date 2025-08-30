import express from "express";
import { 
  updateOrganizationStatus, 
  getOrganizationStatusBreakdown 
} from "../controllers/organization_status.js";
import { verifyToken, checkOrganizationAccess } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Update organization status manually (admin only)
router.put("/update/:organizationId", checkOrganizationAccess, updateOrganizationStatus);

// Get detailed status breakdown
router.get("/breakdown/:organizationId", checkOrganizationAccess, getOrganizationStatusBreakdown);

export default router;

