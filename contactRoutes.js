// server/contactRoutes.js
const express = require("express");
const router = express.Router();

// POST /api/contact  (JSON only)
router.post("/contact", async (req, res) => {
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

    // Log to server (this will show up in Vercel logs)
    console.log("📩 New contact form submission:");
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
    });

    // If you want to save to MongoDB:
    // await Contact.create({ ... });

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (err) {
    console.error("❌ Error handling contact form:", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while submitting the form",
    });
  }
});

module.exports = router;
