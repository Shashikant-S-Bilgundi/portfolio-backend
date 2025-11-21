// contactRoutes.js
const express = require("express");
const Contact = require("./Contact");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    console.log("📩 Incoming /api/contact body:", req.body);

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
    } = req.body || {};

    // basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, subject, and message are required.",
      });
    }

    // ✅ Always try to save – let Mongoose throw if not connected
    const saved = await Contact.create({
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

    console.log("✅ Contact saved with id:", saved._id);

    return res.json({
      success: true,
      saved: true,
      contactId: saved._id,
      message: "Contact submitted successfully.",
    });
  } catch (err) {
    console.error("❌ Error in POST /api/contact:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
});

module.exports = router;
