import User from "../models/user.model.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateToken } from "../config/jwt.js"
import asyncHandler from "../utils/asyncHandler.js"
import { requireFields } from "../utils/validators.js"
import cloudinary from "../config/cloudinary.js"




export const register = asyncHandler(async (req, res) => {
  const missing = requireFields(
    ["rollNumber", "displayName", "password"],
    req.body
  )

  if (missing) {
    res.status(400)
    throw new Error(`${missing} is required`)
  }

  const { rollNumber, displayName, password } = req.body

  const existingUser = await User.findOne({ rollNumber })
  if (existingUser) {
    res.status(409)
    throw new Error("Roll number already registered")
  }

  const hashedPassword = await hashPassword(password)

  let profilePic = ""
  let cloudinaryId = ""

if (req.file) {
  const streamifier = (await import("streamifier")).default

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "semflow_profiles" },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(stream)
  })

  profilePic = result.secure_url
  cloudinaryId = result.public_id
}


  const user = await User.create({
    rollNumber,
    displayName,
    password: hashedPassword,
    profilePic,
    cloudinaryId
  })

  const token = generateToken({ id: user._id })

  res.status(201).json({
    token,
    user: {
      id: user._id,
      rollNumber: user.rollNumber,
      displayName: user.displayName,
      profilePic: user.profilePic
    }
  })
})



export const login = asyncHandler(async (req, res) => {
  const missing = requireFields(["rollNumber", "password"], req.body)

  if (missing) {
    res.status(400)
    throw new Error(`${missing} is required`)
  }

  const { rollNumber, password } = req.body

  const user = await User.findOne({ rollNumber })
  if (!user) {
    res.status(401)
    throw new Error("Invalid credentials")
  }

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    res.status(401)
    throw new Error("Invalid credentials")
  }

  const token = generateToken({ id: user._id })

  res.json({
    token,
    user: {
      id: user._id,
      rollNumber: user.rollNumber,
      displayName: user.displayName
    }
  })
})


export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  if (!req.file) {
    res.status(400)
    throw new Error("No image uploaded")
  }

  const streamifier = (await import("streamifier")).default

  if (user.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(user.cloudinaryId)
    } catch {}
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "semflow_profiles" },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    streamifier.createReadStream(req.file.buffer).pipe(stream)
  })

  user.profilePic = result.secure_url
  user.cloudinaryId = result.public_id
  await user.save()


  
const token = req.headers.authorization?.split(" ")[1]

res.json({
  token,
  user: {
    id: user._id,
    displayName: user.displayName,
    rollNumber: user.rollNumber,
    profilePic: user.profilePic
  }
})



})
