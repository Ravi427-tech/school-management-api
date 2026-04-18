const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { initializeDatabase } = require("./config/db");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply IP rate-limiting to prevent DDoS/Spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use(limiter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management API is running 🎓",
    version: "1.0.0",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude=<lat>&longitude=<lng>",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/", schoolRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const start = async () => {
  await initializeDatabase();
  
  // Vercel serverless environments shouldn't manually bind ports
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
};

start();

module.exports = app; // exported for testing and Vercel serverless
