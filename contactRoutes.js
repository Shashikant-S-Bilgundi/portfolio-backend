// server/contactRoutes.js
const express = require("express");
const multer = require("multer");

const router = express.Router();

// ✅ Use memory storage so we don't write to disk (Vercel-safe)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// POST /api/contact
router.post("/contact", upload.single("file"), async (req, res) => {
  try {
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

    const file = req.file || null;

    // Basic validation
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

    // For now just log (in Vercel logs)
    console.log("New contact form submission:");
    console.log({
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
            mimetype: file.mimetype,
            size: file.size,
          }
        : null,
    });

    // 👉 If you want to store in Mongo, you can do it here:
    // await Contact.create({...});

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
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
