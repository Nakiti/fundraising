import express from "express";
import { createLandingPage, getLandingPage, updateLandingPage } from "../controllers/landing_page.js";

const router = express.Router()

router.post("/create", createLandingPage)
router.put("/update/:id", updateLandingPage)
router.get("/get/:id", getLandingPage)

export default router