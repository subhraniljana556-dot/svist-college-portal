const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  password: { type: String, required: true },
  // INJECTED: Individual attendance tracking! Defaults to 0%.
  attendance: { type: Number, default: 0 } 
});

module.exports = mongoose.model("Student", studentSchema);