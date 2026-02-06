import dotenv from "dotenv"
dotenv.config()

import { v2 as cloudinary } from "cloudinary"

const cloudName = process.env.CLOUD_NAME
const apiKey = process.env.CLOUD_API_KEY
const apiSecret = process.env.CLOUD_API_SECRET

console.log("Cloud:", cloudName)
console.log("Key:", apiKey ? "Loaded" : "Missing")
console.log("Secret:", apiSecret ? "Loaded" : "Missing")

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
})

console.log("Cloudinary configured successfully")

export default cloudinary
