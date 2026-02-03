import User from "../models/user.model.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateToken } from "../config/jwt.js"

export const register = async (req, res) => {
  const { rollNumber, displayName, password } = req.body

  if (!rollNumber || !displayName || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  const existingUser = await User.findOne({ rollNumber })
  if (existingUser) {
    return res.status(409).json({ message: "Roll number already registered" })
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
}

export const login = async (req, res) => {
  const { rollNumber, password } = req.body

  if (!rollNumber || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  const user = await User.findOne({ rollNumber })
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
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
}
