import express from "express"
import { createThankYouPage, getThankYouPage, updateThankYouPage } from "../controllers/thankyou_page.js"

const router = express.Router()

router.post("/create", createThankYouPage)
router.put("/update/:organizationId/:campaignId/:pageId", updateThankYouPage)
router.get("/get/:id", getThankYouPage)

export default router