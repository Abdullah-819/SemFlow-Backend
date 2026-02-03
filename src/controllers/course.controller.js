import Course from "../models/course.model.js"

export const createCourse = async (req, res) => {
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
}

export const getCourses = async (req, res) => {
  const courses = await Course.find({ user: req.user._id })
  res.json(courses)
}

export const updateCourse = async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  if (!course) {
    return res.status(404).json({ message: "Course not found" })
  }

  Object.assign(course, req.body)
  await course.save()

  res.json(course)
}

export const deleteCourse = async (req, res) => {
  const course = await Course.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  if (!course) {
    return res.status(404).json({ message: "Course not found" })
  }

  res.json({ message: "Course deleted" })
}
