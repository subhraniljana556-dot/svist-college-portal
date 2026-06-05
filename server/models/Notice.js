const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: {
    type: String,
    default: () => {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    }
  }
});

module.exports = mongoose.model("Notice", noticeSchema);