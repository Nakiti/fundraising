import express from "express"
import { createHeaderPage, getHeaderPage, updateHeaderPage } from "../controllers/header_page.js"

const router = express.Router()

router.post("/create", createHeaderPage)
router.get("/get/:organizationId", getHeaderPage)
router.put("/update/:organizationId/:pageId", updateHeaderPage)

export default router
