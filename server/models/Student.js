const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  password: { type: String, required: true },
  // Overall attendance percentage — set by HOD via attendance sync
  attendance: { type: Number, default: 0 },
  // Per-lecture attendance log for the dashboard drill-down view.
  // Each entry captures: date, subject name, present/absent, who marked it.
  // Defaults to [] so existing students without logs render gracefully.
  attendanceLog: {
    type: [
      {
        date: { type: Date, default: Date.now },
        subject: { type: String, required: true },
        status: { type: String, enum: ["Present", "Absent"], required: true },
        markedBy: { type: String, default: "HOD" },
      },
    ],
    default: [],
  },
  // Internal assessment marks for CA1–CA4 per subject.
  // Optional — only populated when HOD/Faculty enters marks.
  internalMarks: {
    type: [
      {
        subject: { type: String, required: true },
        ca1: { type: Number, default: 0 },
        ca2: { type: Number, default: 0 },
        ca3: { type: Number, default: 0 },
        ca4: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
  // Semester GPA — computed and stored when marks are finalized
  sgpa: { type: Number, default: 0 },
});

module.exports = mongoose.model("Student", studentSchema);