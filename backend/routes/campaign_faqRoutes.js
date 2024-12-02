import express from "express"
import { createFaqs, deleteFaq, deleteFaqsBatch, getFaqs } from "../controllers/campaign_faqs.js"

const router = express.Router()

router.post("/create/:id", createFaqs)
router.get("/get/:id", getFaqs)
router.delete("/delete/:id", deleteFaq)
router.delete("/deleteBatch", deleteFaqsBatch)

export default router