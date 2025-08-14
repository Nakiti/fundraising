import express from "express"
import { createUser, deleteUser, getCurrentUser, getUser, getUsersbyOrg, login, logout, updatePassword, updateUser } from "../controllers/user.js"
import { verifyToken, requireAdmin, requireOwnerOrAdmin } from "../middleware/auth.js"
import { validateLogin, validateRegistration, validatePasswordUpdate } from "../middleware/validation.js"

const router = express.Router()

// Public routes
router.post("/create", validateRegistration, createUser)
router.post("/login", validateLogin, login)
router.post("/logout", logout)

// Protected routes
router.get("/getCurrentUser", verifyToken, getCurrentUser)
router.put("/updatePassword", validatePasswordUpdate, updatePassword)
 
// Admin/Organization routes
router.get("/get/:id", verifyToken, getUser)
router.get("/getByOrg/:id", verifyToken, getUsersbyOrg)
router.put("/update/:id", verifyToken, requireOwnerOrAdmin, updateUser)
router.delete("/delete/:id", verifyToken, requireAdmin, deleteUser)

export default router
