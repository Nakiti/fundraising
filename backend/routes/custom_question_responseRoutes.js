import express from "express";
import {
  createResponse,
  createResponsesBatch,
  getResponse,
  getResponsesByTransaction,
  getResponsesByQuestion,
  getResponsesByDonor,
  getResponsesByCampaign,
  getResponseStatistics,
  updateResponse,
  deleteResponse,
  deleteResponsesByTransaction
} from "../controllers/custom_question_response.js";

const router = express.Router();

// Create routes
router.post("/", createResponse);
router.post("/batch", createResponsesBatch);

// Read routes
router.get("/:responseId", getResponse);
router.get("/transaction/:transactionId", getResponsesByTransaction);
router.get("/question/:questionId", getResponsesByQuestion);
router.get("/donor/:donorId", getResponsesByDonor);
router.get("/campaign/:campaignId", getResponsesByCampaign);
router.get("/campaign/:campaignId/statistics", getResponseStatistics);

// Update routes
router.put("/:responseId", updateResponse);

// Delete routes
router.delete("/:responseId", deleteResponse);
router.delete("/transaction/:transactionId", deleteResponsesByTransaction);

export default router;



