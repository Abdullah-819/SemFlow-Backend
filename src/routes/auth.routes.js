import express from "express"
import { register, login } from "../controllers/auth.controller.js"
import upload from "../middleware/upload.middleware.js"
import authMiddleware from "../middleware/auth.middleware.js"
import { updateProfilePhoto } from "../controllers/auth.controller.js"



const router = express.Router()
router.post("/register", upload.single("profilePic"), register)
router.post("/login", login)
router.put("/update-photo", authMiddleware, upload.single("profilePic"), updateProfilePhoto)


export default router
