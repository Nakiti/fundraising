import express from "express"
import { createRelationBatch, deleteRelation, deleteRelationBatch, getRelations } from "../controllers/campaign_designation.js"
const router = express.Router()

router.post("/create/:campaign_id", createRelationBatch)
router.delete("/delete/:id", deleteRelation)
router.get("/get/:id", getRelations)
router.delete("/deleteBatch", deleteRelationBatch)

export default router