// server/contactRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Contact = require("./models/Contact"); // ⬅️ add this

const router = express.Router();

// Configure multer for file uploads (stored in /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// POST /api/contact
router.post("/contact", upload.single("file"), async (req, res) => {
  try {
    // Text fields from the form
    const {
      name,
      email,
      phone,
      service,
      budget,
      timeline,
      subject,
      message,
      contactMethod,
      howHeard,
    } = req.body;

    // File (if uploaded)
    const file = req.file || null;

    // Basic validation (same as front-end)
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: "Subject is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 💾 Save to MongoDB
    const contactDoc = await Contact.create({
      name,
      email,
      phone,
      service,
      budget,
      timeline,
      subject,
      message,
      contactMethod,
      howHeard,
      file: file
        ? {
            originalName: file.originalname,
            path: file.path,
            size: file.size,
          }
        : null,
    });

    console.log("New contact form saved:", contactDoc._id);

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
      id: contactDoc._id,
    });
  } catch (err) {
    console.error("Error handling contact form:", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while submitting the form",
    });
  }
});

module.exports = router;
