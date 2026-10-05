const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("../server/config/db");
const authRoutes = require("../server/routes/authRoutes");
const taskRoutes = require("../server/routes/taskRoutes");

// Local development-க்கு server/.env load ஆகும்
dotenv.config({
  path: "./server/.env",
});

const app = express();

// =========================
// DATABASE
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow Backend API is running!",
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// =========================
// EXPORT FOR VERCEL
// =========================

module.exports = app;