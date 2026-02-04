import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import courseRoutes from "./routes/course.routes.js"
import studyLogRoutes from "./routes/studyLog.routes.js"
import errorHandler from "./middleware/error.middleware.js"
import assessmentRoutes from "./routes/assessment.routes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/assessments", assessmentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/logs", studyLogRoutes)

app.get("/", (req, res) => {
  res.send("Semflow API Running")
})

app.use(errorHandler)

export default app
