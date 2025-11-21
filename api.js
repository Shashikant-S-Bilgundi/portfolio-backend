// api.js (backend root)
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRoutes = require("./contactRoutes");

const app = express();
const PORT = process.env.PORT || 3001;
const isVercel = Boolean(process.env.VERCEL);

// ----- MongoDB (optional) -----
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.log("ℹ️ MONGODB_URI not set – skipping Mongo connection");
}

// ----- CORS -----
const allowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-ruddy-two-62.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// (optional) handle preflight
app.options("*", cors({ origin: allowedOrigins }));

// ----- Middleware & Routes -----
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", contactRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Portfolio API is running");
});

// Avoid favicon 500s
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ----- Local dev server -----
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// For Vercel (@vercel/node)
module.exports = app;
