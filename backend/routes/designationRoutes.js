import express from "express"
import { createDesignation, getActiveDesignations, getDesignation, getDesignations, updateDesignation } from "../controllers/designation.js"

const router = express.Router()

router.post("/create", createDesignation)
router.put("/update/:id", updateDesignation)
router.get("/get/:id", getDesignations)
router.get("/getActive/:id", getActiveDesignations)
router.get("/getSingle/:id", getDesignation)

export default router