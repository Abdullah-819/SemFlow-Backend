import express from "express"
import { upsertAssessment, getAssessments } from "../controllers/assessment.controller.js"
import protect from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(protect)

router.get("/", getAssessments)
router.post("/", upsertAssessment)

export default router
