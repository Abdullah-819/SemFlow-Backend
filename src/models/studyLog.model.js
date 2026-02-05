import mongoose from "mongoose"

const studyLogSchema = new mongoose.Schema(
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
    date: {
      type: String,
      required: true
    },
    topicStudied: {
      type: String,
      trim: true,
      default: ""
    },
    topicNotStudied: {
      type: String,
      trim: true,
      default: ""
    },
    quizOccurred: {
      type: Boolean,
      default: false
    },
    remarks: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["Completed", "Pending"],
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("StudyLog", studyLogSchema)
