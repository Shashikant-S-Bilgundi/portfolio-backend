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

// ✅ CORS – allow local + deployed frontend
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

// Parse JSON bodies
app.use(express.json());

// (Uploads static only used locally; safe to keep or remove)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use contact routes under /api
app.use("/api", contactRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Favicon (avoid random 500s on /favicon.ico)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Root
app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

// Start server (local dev)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
