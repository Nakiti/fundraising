import express from "express"
import { createPreview, getPreview, updatePreview } from "../controllers/preview.js"

const router = express.Router()

router.post("/create", createPreview)
router.get("/get/:id", getPreview)
router.put("/update/:id", updatePreview)

export default router
