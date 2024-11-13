import express from "express"
import { createUserOrganizationRelation, getUserOrganizations } from "../controllers/user_organization.js"


const router = express.Router()

router.get("/get/:id", getUserOrganizations)
router.post("/create", createUserOrganizationRelation)

export default router