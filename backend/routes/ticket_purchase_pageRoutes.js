import express from "express"
import { createTicketPurchasePage, getTicketPurchasePage, updateTicketPurchasePage } from "../controllers/ticket_purchase_page.js"

const router = express.Router()

router.get("/get/:id", getTicketPurchasePage)
router.post("/create", createTicketPurchasePage)
router.put("/update/:id", updateTicketPurchasePage)

export default router

