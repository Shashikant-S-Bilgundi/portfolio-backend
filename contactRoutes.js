const express = require("express");
const mongoose = require("mongoose");
const Contact = require("./Contact");

const router = express.Router();

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
    } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, subject, and message are required.",
      });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      console.log("⚠️ MongoDB not connected – logging contact only:");
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

      return res.json({
        success: true,
        saved: false,
        message:
          "Contact received (not stored in DB – MongoDB is not configured on this server).",
      });
    }

    const newContact = new Contact({
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

    const saved = await newContact.save();

    res.json({
      success: true,
      saved: true,
      contactId: saved._id,
      message: "Contact submitted successfully.",
    });
  } catch (err) {
    console.error("❌ Error in POST /api/contact:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
