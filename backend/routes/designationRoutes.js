import express from "express"
import { createDesignation, getActiveDesignations, getDesignation, getDesignations, updateDesignation, getDesignationsByCampaign, getDefaultDesignation } from "../controllers/designation.js"

const router = express.Router()

router.post("/create", createDesignation)
router.put("/update/:id", updateDesignation)
router.get("/org/:id", getDesignations)
router.get("/active/:id", getActiveDesignations)
router.get("/getSingle/:id", getDesignation)
router.get("/campaign/:id", getDesignationsByCampaign)
router.get("/default/:id", getDefaultDesignation)

export default router