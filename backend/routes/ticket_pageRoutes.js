import express from "express"
import { createTicketPage, getTicketPage, updateTicketPage } from "../controllers/ticket_page.js"

const router = express.Router()

router.post("/create", createTicketPage)
router.get("/get/:id", getTicketPage)
router.put("/update/:id", updateTicketPage)

export default router