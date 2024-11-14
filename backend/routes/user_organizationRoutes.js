import express from "express"
import { createUserOrganizationRelation, getPendingUserOrganizations, getUserOrganizations, updateUserOrganizationRelation } from "../controllers/user_organization.js"


const router = express.Router()

router.get("/get/:id", getUserOrganizations)
router.post("/create", createUserOrganizationRelation)
router.get("/getPending/:id", getPendingUserOrganizations)
router.put("/update/:id", updateUserOrganizationRelation)

export default router