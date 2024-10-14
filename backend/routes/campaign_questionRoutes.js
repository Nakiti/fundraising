import express from "express";
import { createCustomQuestion, deleteCustomQuestion } from "../controllers/campaign_question";

const router = express.Router()

router.post("/create", createCustomQuestion)
router.delete("/delete/:id", deleteCustomQuestion)

export default router