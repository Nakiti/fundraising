import express from "express"
import { createFaqs, deleteFaq, getFaqs } from "../controllers/campaign_faqs.js"

const router = express.Router()

router.post("/create/:id", createFaqs)
router.get("/get/:id", getFaqs)
router.delete("/delete/:id", deleteFaq)

export default router