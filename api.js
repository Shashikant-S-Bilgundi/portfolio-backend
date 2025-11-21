// server/api.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRoutes = require("./contactRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// 🔗 MongoDB connection (optional in Vercel)
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
} else {
  console.log("ℹ️ No MONGODB_URI set – skipping Mongo connection");
}

// ✅ Simple CORS allowing your frontend + localhost
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://portfolio-ruddy-two-62.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Preflight
app.options("*", cors());

// Parse JSON
app.use(express.json());

// (Uploads static only used locally now; memory storage on Vercel)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Favicon
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Root
app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
