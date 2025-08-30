import { createCampaign, deactivateCampaign, getActive, getCampaign, getCampaignsByOrg, getDateRange, getFiltered, searchCampaigns, updateCampaign, getCampaignInsights, sumRaised } from "../controllers/campaign.js"
import express from "express"

const router = express.Router()


router.post("/create", createCampaign)
router.get("/get/:id", getCampaign)
router.get("/getByOrg/:id", getCampaignsByOrg)
router.put("/update/:id", updateCampaign)
router.get("/getActive", getActive)
router.get("/getFiltered/:id", getFiltered)
router.get("/search/:id", searchCampaigns)
router.put("/deactivate/:id", deactivateCampaign)  
router.get("/getDateRange/:id", getDateRange)
router.get("/insights/:id", getCampaignInsights)
router.get("/sumRaised/:id", sumRaised)

export default router