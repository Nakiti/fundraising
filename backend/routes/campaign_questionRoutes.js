import express from "express";
import { createCustomQuestion, deleteCustomQuestion, deleteCustomQuestionsBatch, getCustomQuestions } from "../controllers/campaign_question.js";

const router = express.Router() 

router.post("/add/:id", createCustomQuestion)
router.delete("/remove/:id", deleteCustomQuestion)
router.get("/get/:id", getCustomQuestions)
router.delete("/removeBatch", deleteCustomQuestionsBatch)

export default router