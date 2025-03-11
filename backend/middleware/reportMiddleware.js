const mongoose = require("mongoose");

// Middleware to validate student ID
const validateStudentId = (req, res, next) => {
  const { studentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: "Invalid student ID" });
  }
  next();
};

// Middleware to validate report date
const validateReportDate = (req, res, next) => {
  const { date } = req.body;
  const reportDate = date ? new Date(date) : new Date();
  if (isNaN(reportDate.getTime())) {
    return res.status(400).json({ success: false, message: "Invalid date format" });
  }
  next();
};

module.exports = {
  validateStudentId,
  validateReportDate,
};