import { createCampaign, getActive, getCampaign, getCampaignsByOrg, getFiltered, updateCampaign } from "../controllers/campaign.js"
import express from "express"

const router = express.Router()


router.post("/create", createCampaign)
router.get("/get/:id", getCampaign)
router.get("/getByOrg/:id", getCampaignsByOrg)
router.put("/update/:id", updateCampaign)
router.get("/getActive", getActive)
router.get("/getFiltered/:id", getFiltered)

export default router