import express from "express"
import { createFooterPage, getFooterPage, updateFooterPage } from "../controllers/footer_page.js"

const router = express.Router()

router.post("/create", createFooterPage)
router.get("/get/:organizationId", getFooterPage)
router.put("/update/:id", updateFooterPage)

export default router
