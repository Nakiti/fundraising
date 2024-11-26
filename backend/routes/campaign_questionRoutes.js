import express from "express";
import { createCustomQuestion, deleteCustomQuestion, deleteCustomQuestionsBatch, getCustomQuestions } from "../controllers/campaign_question.js";

const router = express.Router()

router.post("/create/:id", createCustomQuestion)
router.delete("/delete/:id", deleteCustomQuestion)
router.get("/get/:id", getCustomQuestions)
router.delete("/deleteBatch", deleteCustomQuestionsBatch)

export default router