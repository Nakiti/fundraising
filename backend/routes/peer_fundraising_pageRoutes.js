import express from "express"
import { createPeerFundraisingPage, getPeerFundraisingPage, updatePeerFundraisingPage } from "../controllers/peer_fundraising_page.js"

const router = express.Router()

router.get("/get/:id", getPeerFundraisingPage)
router.post("/create", createPeerFundraisingPage)
router.put("/update/:id", updatePeerFundraisingPage)

export default router