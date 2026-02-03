import User from "../models/user.model.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateToken } from "../config/jwt.js"
import asyncHandler from "../utils/asyncHandler.js"

export const register = asyncHandler(async (req, res) => {
  const { rollNumber, displayName, password } = req.body

  if (!rollNumber || !displayName || !password) {
    res.status(400)
    throw new Error("All fields required")
  }

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
  const { rollNumber, password } = req.body

  if (!rollNumber || !password) {
    res.status(400)
    throw new Error("All fields required")
  }

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
