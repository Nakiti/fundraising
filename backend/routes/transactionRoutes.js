import express from "express"
import { createTransaction, getAllTransactions, getTransaction, getTransactionsbyCampaign, updateTransaction } from "../controllers/transaction.js"

const router = express.Router()

router.post("/create", createTransaction)
router.get("/get/:id", getTransaction)
router.get("/getByCampaign/:id", getTransactionsbyCampaign)
router.get("/getByOrg/:id", getAllTransactions)
router.put("/update/:id", updateTransaction)

export default router
