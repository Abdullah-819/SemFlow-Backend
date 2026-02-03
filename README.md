# Semflow Backend
This is the backend service for **Semflow**, a secure and scalable semester management and daily study tracking application.
The backend is built using Node.js and Express, follows an MVC architecture, and provides RESTful APIs for authentication, course management, daily study logs, and AI-assisted academic insights.

---
## 🚀 Core Responsibilities
- User authentication and authorization
- Secure API endpoints
- Course management logic
- Daily study log management
- AI-based academic analysis (rule-based)
- GPA calculation logic (future scope)

---
## 🧱 Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt (password hashing)

---
backend/
├── server.js
├── .env
└── src/
├── app.js
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
└── validators/

---
## 🔐 Authentication
- Users register using a **unique roll number**
- Passwords are stored using secure hashing
- JWT tokens are issued on login
- Protected routes require a valid token

---
## 📚 Course Management API
- Create, update, delete, and view courses
- Supports both theory-only and theory + lab courses
- Lab-related fields are ignored when not applicable

---
## 📝 Daily Study Log APP
- Course-specific and date-based logs
- Tracks studied and missed topics
- Quiz occurrence tracking
- Editable and removable logs

---

## 🤖 AI Module (Rule-Based)
- Analyzes study patterns and missed topics
- Generates academic insights and study priorities
- Designed to align with Artificial Intelligence coursework
  
---
## 🧮 GPA Module (Future Scope)
- GPA calculation logic is backend-only
- Designed to be extensible when grading rules are provided

---

## ⚙️ Environment Variables
Create a `.env` file in the backend root:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
---

## ▶️ Running the Backend
npm install
npm run dev
The server will start on the configured port.
---

## 📡 API Testing
Use Postman or any REST client to test APIs.
Authentication token must be sent via:
Authorization: Bearer <token>
---

## 📜 License
This backend is developed for educational and academic purposes.


## 📂 Folder Structure

