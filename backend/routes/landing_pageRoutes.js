import express from "express";
import { createLandingPage, updateLandingPage } from "../controllers/landing_page.js";

const router = express.Router()

router.post("/create", createLandingPage)
router.put("/update/:id", updateLandingPage)

export default router