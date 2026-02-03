import mongoose from "mongoose"

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courseName: {
      type: String,
      required: true,
      trim: true
    },
    creditHours: {
      type: Number,
      required: true
    },
    theoryAssignments: {
      type: Number,
      required: true
    },
    theoryQuizzes: {
      type: Number,
      required: true
    },
    hasLab: {
      type: Boolean,
      required: true
    },
    labHours: {
      type: Number
    },
    labAssignments: {
      type: Number
    },
    labQuizzes: {
      type: Number
    }
  },
  { timestamps: true }
)

export default mongoose.model("Course", courseSchema)
