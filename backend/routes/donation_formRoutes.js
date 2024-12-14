import express from 'express'
import { createDonationForm, getDonationForm, updateDonationForm } from '../controllers/donation_form.js'

const router = express.Router()

router.get("/get/:id", getDonationForm)
router.post("/create", createDonationForm)
router.put("/update/:id", updateDonationForm)

export default router