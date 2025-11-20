// server/models/Contact.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    path: String,
    size: Number,
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    service: String,
    budget: String,
    timeline: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    contactMethod: { type: String, default: "email" },
    howHeard: String,
    file: fileSchema,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Contact", contactSchema);
