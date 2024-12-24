import express from "express"
import { createCampaignTicketBatch, deleteCampaignTicketsBatch, getCampaignTickets } from "../controllers/campaign_ticket.js"

const router = express.Router()

router.get("/get/:id", getCampaignTickets)
router.post("/create/:id", createCampaignTicketBatch)
router.delete("/deleteBatch", deleteCampaignTicketsBatch)

export default router