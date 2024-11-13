import express from "express"
import { createUser, deleteUser, getCurrentUser, getUser, getUsersbyOrg, login, logout, updatePassword, updateUser } from "../controllers/user.js"

const router = express.Router()

router.post("/create", createUser)
router.post("/login", login)
router.put("/upadtePassword", updatePassword)
router.post("/logout", logout)
router.get("/get/:id", getUser)
router.get("/getCurrentUser", getCurrentUser)
router.get("/getByOrg/:id", getUsersbyOrg)
router.put("/update/:id", updateUser)
router.delete("/delete/:id", deleteUser)

export default router
