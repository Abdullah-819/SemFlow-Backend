import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
  addLog,
  getLogsByCourse,
  updateLog,
  deleteLog
} from "../controllers/studyLog.controller.js"

const router = express.Router()

router.use(authMiddleware)

router.post("/course/:courseId", addLog)
router.get("/course/:courseId", getLogsByCourse)
router.put("/:id", updateLog)
router.delete("/:id", deleteLog)

export default router
