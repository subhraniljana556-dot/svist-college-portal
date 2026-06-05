const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  rank: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admission", admissionSchema);