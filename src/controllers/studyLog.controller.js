import StudyLog from "../models/studyLog.model.js"
import Course from "../models/course.model.js"

export const addLog = async (req, res) => {
  const { courseId } = req.params

  const course = await Course.findOne({
    _id: courseId,
    user: req.user._id
  })

  if (!course) {
    return res.status(404).json({ message: "Course not found" })
  }

  const log = await StudyLog.create({
    user: req.user._id,
    course: courseId,
    ...req.body
  })

  res.status(201).json(log)
}

export const getLogsByCourse = async (req, res) => {
  const { courseId } = req.params

  const logs = await StudyLog.find({
    user: req.user._id,
    course: courseId
  }).sort({ date: -1 })

  res.json(logs)
}

export const updateLog = async (req, res) => {
  const log = await StudyLog.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!log) {
    return res.status(404).json({ message: "Log not found" })
  }

  Object.assign(log, req.body)
  await log.save()

  res.json(log)
}

export const deleteLog = async (req, res) => {
  const log = await StudyLog.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  if (!log) {
    return res.status(404).json({ message: "Log not found" })
  }

  res.json({ message: "Log deleted" })
}
