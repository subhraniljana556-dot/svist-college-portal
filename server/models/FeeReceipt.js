const mongoose = require("mongoose");

const feeReceiptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentRoll: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  feeType: {
    type: String,
    default: "Semester Tuition Fee",
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    default: "NetBanking / UPI / Card",
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Paid",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FeeReceipt", feeReceiptSchema);
