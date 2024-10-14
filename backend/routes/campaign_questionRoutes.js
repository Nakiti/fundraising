import express from "express";
import { createCustomQuestion, deleteCustomQuestion } from "../controllers/campaign_question.js";

const router = express.Router()

router.post("/create/:id", createCustomQuestion)
router.delete("/delete/:id", deleteCustomQuestion)

export default router