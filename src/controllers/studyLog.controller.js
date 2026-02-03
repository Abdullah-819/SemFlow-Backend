import StudyLog from "../models/studyLog.model.js"
import Course from "../models/course.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { requireFields } from "../utils/validators.js"

export const addLog = asyncHandler(async (req, res) => {
  const missing = requireFields(["date", "status"], req.body)

  if (missing) {
    res.status(400)
    throw new Error(`${missing} is required`)
  }

  const { courseId } = req.params

  const course = await Course.findOne({
    _id: courseId,
    user: req.user._id
  })

  if (!course) {
    res.status(404)
    throw new Error("Course not found")
  }

  const log = await StudyLog.create({
    user: req.user._id,
    course: courseId,
    ...req.body
  })

  res.status(201).json(log)
})

export const getLogsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params

  const logs = await StudyLog.find({
    user: req.user._id,
    course: courseId
  })
    .populate("course", "courseName creditHours")
    .sort({ date: -1 })

  res.json(logs)
})

export const updateLog = asyncHandler(async (req, res) => {
  const log = await StudyLog.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!log) {
    res.status(404)
    throw new Error("Log not found")
  }

  Object.assign(log, req.body)
  await log.save()

  res.json(log)
})

export const deleteLog = asyncHandler(async (req, res) => {
  const log = await StudyLog.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  if (!log) {
    res.status(404)
    throw new Error("Log not found")
  }

  res.json({ message: "Log deleted" })
})
