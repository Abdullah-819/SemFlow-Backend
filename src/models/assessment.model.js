import mongoose from "mongoose"

const marksSchema = new mongoose.Schema({
  obtained: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    semester: {
      type: String,
      required: true
    },

    creditHours: {
      type: Number,
      required: true,
      enum: [3, 4]
    },

    hasLab: {
      type: Boolean,
      required: true
    },

    theory: {
      assignments: [marksSchema],
      quizzes: [marksSchema],
      mid: {
        obtained: Number,
        total: { type: Number, default: 25 }
      },
      final: {
        obtained: Number,
        total: { type: Number, default: 50 }
      },
      percentage: Number
    },

    lab: {
      assignments: [marksSchema],
      mid: {
        obtained: Number,
        total: { type: Number, default: 25 }
      },
      final: {
        obtained: Number,
        total: { type: Number, default: 50 }
      },
      percentage: Number
    },

    finalMarks: {
      type: Number
    },

    grade: {
      type: String,
      enum: ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]
    },

    gradePoints: {
      type: Number
    },

    eligibleForImprovement: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model("Assessment", assessmentSchema)
