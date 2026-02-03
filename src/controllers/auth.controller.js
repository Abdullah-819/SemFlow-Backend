import User from "../models/user.model.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateToken } from "../config/jwt.js"
import asyncHandler from "../utils/asyncHandler.js"
import { requireFields } from "../utils/validators.js"

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

  const user = await User.create({
    rollNumber,
    displayName,
    password: hashedPassword
  })

  const token = generateToken({ id: user._id })

  res.status(201).json({
    token,
    user: {
      id: user._id,
      rollNumber: user.rollNumber,
      displayName: user.displayName
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
