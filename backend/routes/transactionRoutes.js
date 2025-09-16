import express from "express"
import { createTransaction, createTransactionWithResponses, getAllTransactions, getFiltered, getTransaction, getTransactionForThankYou, getTransactionsbyCampaign, getTransactionsByCampaignInOrg, getTransactionsOverTime, searchTransactions, updateTransaction } from "../controllers/transaction.js"

const router = express.Router()

router.post("/create", createTransaction)
router.post("/create-with-responses", createTransactionWithResponses)
router.get("/get/:id", getTransaction)
router.get("/thank-you", getTransactionForThankYou)
router.get("/campaign/:id", getTransactionsbyCampaign)
router.get("/getByCampaign/:campaignId/org/:organizationId", getTransactionsByCampaignInOrg)
router.get("/org/:id", getAllTransactions)
router.put("/update/:id", updateTransaction)
router.get("/getTimeframe/:id", getTransactionsOverTime)
router.get("/search/:id", searchTransactions)
router.get("/getFiltered/:id", getFiltered)

export default router
