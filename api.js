// api.js (backend root)
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRoutes = require("./contactRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// --------------------
// 🔗 MongoDB connection
// --------------------
const isVercel = !!process.env.VERCEL; // true on Vercel

let MONGODB_URI = process.env.MONGODB_URI || "";

// For local development, fall back to local Mongo if not set
if (!MONGODB_URI && !isVercel) {
  MONGODB_URI = "mongodb://127.0.0.1:27017/portfolio_db";
}

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

// --------------------
// ✅ CORS
// --------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-ruddy-two-62.vercel.app", // your frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ CORS blocked origin:", origin);
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Preflight
app.options("*", cors());

// --------------------
// Middleware & Routes
// --------------------
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", contactRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Avoid 500 on /favicon.ico
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

// --------------------
// Local dev server
// --------------------
if (!isVercel && process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export app for Vercel (@vercel/node)
module.exports = app;
