import Course from "../models/course.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { requireFields } from "../utils/validators.js"

export const createCourse = asyncHandler(async (req, res) => {
  const missing = requireFields(
    ["courseName", "creditHours", "theoryAssignments", "theoryQuizzes", "hasLab"],
    req.body
  )

  if (missing) {
    res.status(400)
    throw new Error(`${missing} is required`)
  }

  const {
    courseName,
    creditHours,
    theoryAssignments,
    theoryQuizzes,
    hasLab,
    labHours,
    labAssignments,
    labQuizzes
  } = req.body

  const courseData = {
    user: req.user._id,
    courseName,
    creditHours,
    theoryAssignments,
    theoryQuizzes,
    hasLab
  }

  if (hasLab) {
    courseData.labHours = labHours
    courseData.labAssignments = labAssignments
    courseData.labQuizzes = labQuizzes
  }

  const course = await Course.create(courseData)
  res.status(201).json(course)
})

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ user: req.user._id })
  res.json(courses)
})

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!course) {
    res.status(404)
    throw new Error("Course not found")
  }

  Object.assign(course, req.body)
  await course.save()

  res.json(course)
})

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  if (!course) {
    res.status(404)
    throw new Error("Course not found")
  }

  res.json({ message: "Course deleted" })
})
