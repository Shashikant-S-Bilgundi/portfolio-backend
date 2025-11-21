// server/api.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRoutes = require("./contactRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// 🔗 MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ CORS – allow both local & deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-ruddy-two-62.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Optional: handle preflight for all routes
app.options("*", cors());

// JSON body (for non-file routes)
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", contactRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
