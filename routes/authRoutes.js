import express from "express"
import {
    Login, Register, Logout, getUserProfile, updateUserProfile, getUsers, deleteUser,
    getUserById, updateUserById
} from "../controllers/authController.js"
import { protect, admin } from "../middleware/authMiddleware.js"
const router = express.Router()

router.route("/").post(Register).get(protect,admin,getUsers)
router.post("/logout", Logout)
router.post("/login", Login)
router.route("/profile").get(protect,getUserProfile).put(protect,updateUserProfile)
router.route("/:id").delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUserById)















export default router;