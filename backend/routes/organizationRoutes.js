import express from "express"
import { get, register, update } from "../controllers/organization.js"

const router = express.Router()

router.post("/register", register)
router.get("/get/:id", get)
router.put("/update/:id", update)

export default router