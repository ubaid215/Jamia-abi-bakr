const mongoose = require("mongoose");

const DailyReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  sabaq: { type: String, required: function () { return this.attendance === "Present"; } },
  sabaqMistakes: { type: Number, required: function () { return this.attendance === "Present"; } },
  sabqi: { type: String, required: function () { return this.attendance === "Present"; } },
  sabqiMistakes: { type: Number, required: function () { return this.attendance === "Present"; } },
  manzil: { type: String, required: function () { return this.attendance === "Present"; } },
  manzilMistakes: { type: Number, required: function () { return this.attendance === "Present"; } },
  condition: { type: String, required: true },
  attendance: { type: String, required: true, enum: ["Present", "Absent", "Leave"] },
});

module.exports = mongoose.model("DailyReport", DailyReportSchema);
