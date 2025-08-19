import express from "express"
import { createSection, getSection, getSectionByPage, getSectionsByPage, updateSection, updateSectionOrder } from "../controllers/section.js"

const router = express.Router()

router.post("/create", createSection)
router.put("/update/:id", updateSection)
router.put("/updateOrder", updateSectionOrder)
router.get("/get/:id", getSection) 
router.get("/getSectionsByPage/:id", getSectionByPage) // Legacy endpoint
router.get("/getSectionsByPage", getSectionsByPage) // New endpoint with query parameters

export default router