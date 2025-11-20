// server/api.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config(); // <-- add this
const contactRoutes = require("./contactRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// 🔗 Connect to MongoDB
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

// Allow your React app to call this API
app.use(
  cors({
    origin: "http://localhost:3000", // change if needed
  })
);

// For non-file JSON routes
app.use(express.json());

// Serve uploaded files if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use contact routes under /api
app.use("/api", contactRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
