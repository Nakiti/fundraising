import express from "express"
import { createDonationPage, getDonationPage, updateDonationPage } from "../controllers/donation_page.js"

const router = express.Router()

router.post("/create", createDonationPage)
router.get("/get/:id", getDonationPage)
router.put("/update/:id", updateDonationPage)

export default router
