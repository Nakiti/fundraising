import express from "express"
import { createDesignation, getActiveDesignations, getDesignation, getDesignations, updateDesignation, getDesignationsByCampaign } from "../controllers/designation.js"

const router = express.Router()

router.post("/create", createDesignation)
router.put("/update/:id", updateDesignation)
router.get("/get/:id", getDesignations)
router.get("/active/:id", getActiveDesignations)
router.get("/getSingle/:id", getDesignation)
router.get("/campaign/:id", getDesignationsByCampaign)

export default router