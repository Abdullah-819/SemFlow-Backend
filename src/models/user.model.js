import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      default: ""
    },
    cloudinaryId: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)
