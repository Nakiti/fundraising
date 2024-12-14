import express from "express"
import { createPeerLandingPage, getPeerLandingPage, updatePeerLandingPage } from "../controllers/peer_landing_page.js"

const router = express.Router()

router.get("/get/:id", getPeerLandingPage)
router.post("/create", createPeerLandingPage)
router.put("/update/:id", updatePeerLandingPage)

export default router