import express from "express"
import { createSection, getSection, getSectionByPage, updateSection } from "../controllers/section.js"

const router = express.Router()

router.post("/create", createSection)
router.put("/update/:id", updateSection)
router.get("/get/:id", getSection) 
router.get("/getSectionsByPage/:id", getSectionByPage)

export default router