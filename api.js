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

/**
 * ✅ CORS
 * For a personal portfolio API, it's fine to allow all origins.
 * This avoids CORS errors from your Vercel frontends and previews.
 * If you want to restrict later, we can swap this to a whitelist.
 */
const corsOptions = {
  origin: "*", // allow all origins (you can tighten this later)
  methods: ["GET", "POST", "OPTIONS"],
};

app.use(cors(corsOptions));
// Explicitly handle preflight
app.options("*", cors(corsOptions));

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
