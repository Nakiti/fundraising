import express from "express"
import { createCampaignDetails, getCampaignDetails, updateCampaignDetails } from "../controllers/campaign_details.js"

const router = express.Router()

router.post("/create", createCampaignDetails)
router.put("/update/:id", updateCampaignDetails)
router.get("/get/:id", getCampaignDetails)

export default router