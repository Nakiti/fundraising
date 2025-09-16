import express from "express"
import { createSection, getSection, getSectionByPage, getSectionsByPage, updateSection, updateSectionOrder, bulkUpdateSections } from "../controllers/section.js"

const router = express.Router()

// New API structure for page_sections table
router.post("/createByPage", createSection)
router.put("/update/:id", updateSection)
router.put("/updateOrder", updateSectionOrder)
router.put("/bulkUpdate", bulkUpdateSections)

// Primary endpoint for getting sections by page context (new structure)
router.get("/getByPage", getSectionsByPage)

// Get individual section by section ID
router.get("/get/:id", getSection)

// Legacy endpoint for backward compatibility (deprecated)
router.get("/getByPage/:id", getSectionByPage)

export default router