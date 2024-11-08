import { createCampaign, deactivateCampaign, getActive, getCampaign, getCampaignsByOrg, getDateRange, getFiltered, searchCampaigns, updateCampaign } from "../controllers/campaign.js"
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

export default router