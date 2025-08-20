import express from "express"
import { createAboutPage, getAboutPage, updateAboutPage } from "../controllers/about_page.js"

const router = express.Router()

router.post("/create", createAboutPage)
router.get("/get/:id", getAboutPage)
router.put("/update/:id", updateAboutPage)

export default router