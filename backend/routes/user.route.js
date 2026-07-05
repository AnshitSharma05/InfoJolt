import express from "express"
import { getAllUsers, getMe, login, logout, register, resetPassword, updateProfile } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated, getMe)
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile)
router.route("/reset-password").post(resetPassword)
router.get('/all-users', getAllUsers);

export default router;
