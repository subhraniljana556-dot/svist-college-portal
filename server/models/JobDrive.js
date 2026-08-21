const mongoose = require("mongoose");

const jobDriveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: true,
  },
  eligibilityCriteria: {
    minSgpa: {
      type: Number,
      default: 6.5,
    },
    allowedDepartments: {
      type: [String],
      default: ["CSE", "ECE", "EE", "ME", "CE", "AI & DS"],
    },
  },
  deadline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "Kolkata / Hybrid",
  },
  applicants: {
    type: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        studentRoll: {
          type: String,
          required: true,
        },
        studentName: {
          type: String,
          required: true,
        },
        sgpa: {
          type: Number,
          default: 0,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobDrive", jobDriveSchema);
