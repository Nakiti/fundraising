import express from "express"
import { 
  createOrFindGuestDonor, 
  getGuestDonor, 
  updateGuestDonor, 
  getGuestDonorsByOrganization 
} from "../controllers/guestDonor.js"

const router = express.Router()

router.post("/create", createOrFindGuestDonor)
router.get("/get/:id", getGuestDonor)
router.put("/update/:id", updateGuestDonor)
router.get("/getByOrg/:organizationId", getGuestDonorsByOrganization)

export default router
