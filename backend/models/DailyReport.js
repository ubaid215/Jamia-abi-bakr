const mongoose = require("mongoose");

const DailyReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  sabaq: { type: String, required: true },
  sabaqMistakes: { type: Number, required: true },
  sabqi: { type: String, required: true },
  sabqiMistakes: { type: Number, required: true },
  manzil: { type: String, required: true },
  manzilMistakes: { type: Number, required: true },
  condition: { type: String, required: true },
  attendance: { type: String, required: true },
});

module.exports = mongoose.model("DailyReport", DailyReportSchema);