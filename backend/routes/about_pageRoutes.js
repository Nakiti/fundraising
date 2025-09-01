import express from "express"
import { createAboutPage, getAboutPage, updateAboutPage } from "../controllers/about_page.js"

const router = express.Router()

router.post("/create", createAboutPage)
router.get("/get/:organizationId", getAboutPage)
router.put("/update/:organizationId", updateAboutPage)

export default router