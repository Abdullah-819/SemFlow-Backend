import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
} from "../controllers/course.controller.js"

const router = express.Router()

router.use(authMiddleware)

router.post("/", createCourse)
router.get("/", getCourses)
router.put("/:id", updateCourse)
router.delete("/:id", deleteCourse)

export default router
