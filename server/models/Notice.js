const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  // Optional document attachment URL (Google Drive, PDF link, etc.)
  // Previously used in frontend but missing from schema — Mongoose was
  // silently stripping this field from saved documents.
  documentUrl: { type: String, default: "" },
  date: {
    type: String,
    default: () => {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    }
  }
});

module.exports = mongoose.model("Notice", noticeSchema);