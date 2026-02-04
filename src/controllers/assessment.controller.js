import Assessment from "../models/assessment.model.js"
import Course from "../models/course.model.js"
import asyncHandler from "../utils/asyncHandler.js"

const gradeMap = [
  { min: 85, grade: "A", points: 4.0 },
  { min: 80, grade: "A-", points: 3.66 },
  { min: 75, grade: "B+", points: 3.33 },
  { min: 71, grade: "B", points: 3.0 },
  { min: 68, grade: "B-", points: 2.66 },
  { min: 64, grade: "C+", points: 2.33 },
  { min: 61, grade: "C", points: 2.0 },
  { min: 58, grade: "C-", points: 1.66 },
  { min: 54, grade: "D+", points: 1.3 },
  { min: 50, grade: "D", points: 1.0 },
  { min: 0, grade: "F", points: 0.0 }
]

const calculatePercentage = items => {
  let obtained = 0
  let total = 0
  items.forEach(i => {
    obtained += i.obtained
    total += i.total
  })
  return total === 0 ? 0 : (obtained / total) * 100
}

const resolveGrade = percentage => {
  return gradeMap.find(g => percentage >= g.min)
}

export const upsertAssessment = asyncHandler(async (req, res) => {
  const { courseId, semester, theory, lab } = req.body
  const userId = req.user._id

  const course = await Course.findOne({ _id: courseId, user: userId })
  if (!course) {
    res.status(404)
    throw new Error("Course not found")
  }

  let theoryPercentage = 0
  let labPercentage = 0

  if (theory) {
    const assignmentsPct = calculatePercentage(theory.assignments || [])
    const quizzesPct = calculatePercentage(theory.quizzes || [])

    let obtained = 0
    let total = 0

    theory.assignments?.forEach(a => {
      obtained += a.obtained
      total += a.total
    })

    theory.quizzes?.forEach(q => {
      obtained += q.obtained
      total += q.total
    })

    if (theory.mid?.obtained !== undefined) {
      obtained += theory.mid.obtained
      total += 25
    }

    if (theory.final?.obtained !== undefined) {
      obtained += theory.final.obtained
      total += 50
    }

    theoryPercentage = total === 0 ? 0 : (obtained / total) * 100
  }

  if (course.hasLab && lab) {
    let obtained = 0
    let total = 0

    lab.assignments?.forEach(a => {
      obtained += a.obtained
      total += a.total
    })

    if (lab.mid?.obtained !== undefined) {
      obtained += lab.mid.obtained
      total += 25
    }

    if (lab.final?.obtained !== undefined) {
      obtained += lab.final.obtained
      total += 50
    }

    labPercentage = total === 0 ? 0 : (obtained / total) * 100
  }

  let theoryWeight = 1
  let labWeight = 0

  if (course.hasLab) {
    if (course.creditHours === 3) {
      theoryWeight = 0.67
      labWeight = 0.33
    } else {
      theoryWeight = 0.75
      labWeight = 0.25
    }
  }

  const finalMarks =
    theoryPercentage * theoryWeight + labPercentage * labWeight

  const resolved = resolveGrade(finalMarks)

  const assessment = await Assessment.findOneAndUpdate(
    { user: userId, course: courseId, semester },
    {
      user: userId,
      course: courseId,
      semester,
      creditHours: course.creditHours,
      hasLab: course.hasLab,
      theory: {
        ...theory,
        percentage: theoryPercentage
      },
      lab: course.hasLab
        ? {
            ...lab,
            percentage: labPercentage
          }
        : undefined,
      finalMarks,
      grade: resolved.grade,
      gradePoints: resolved.points,
      eligibleForImprovement: resolved.grade >= "C"
    },
    { new: true, upsert: true }
  )

  res.status(200).json(assessment)
})

export const getAssessments = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ user: req.user._id }).populate(
    "course"
  )
  res.status(200).json(assessments)
})
