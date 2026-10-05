const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const connectDB = require("../../server/config/db");
const authRoutes = require("../../server/routes/authRoutes");
const taskRoutes = require("../../server/routes/taskRoutes");

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

app.get("/api", (req, res) => {
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
// NETLIFY FUNCTION
// =========================

module.exports.handler = serverless(app);
