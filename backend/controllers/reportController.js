const DailyReport = require("../models/DailyReport");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");


const checkWeeklyPerformance = async (studentId) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date 7 days ago
  
      // Fetch reports for the last 7 days
      const reports = await DailyReport.find({
        studentId,
        date: { $gte: oneWeekAgo },
      });
  
      // Check if any report has a condition of "Below Average" or "Need Focus"
      const hasPoorPerformance = reports.some(
        (report) =>
          report.condition === "Below Average" || report.condition === "Need Focus"
      );
  
      return hasPoorPerformance;
    } catch (error) {
      console.error("Error checking weekly performance:", error);
      return false;
    }
  };

// Save a daily report for a student
const saveReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, sabaq, sabaqMistakes, sabqi, sabqiMistakes, manzil, manzilMistakes, attendance } = req.body;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Validate required fields
    if (!sabaq || !sabqi || !manzil || !attendance || sabaqMistakes === undefined || sabqiMistakes === undefined || manzilMistakes === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Sanitize inputs
    const sanitizedSabaq = sanitizeHtml(sabaq);
    const sanitizedSabqi = sanitizeHtml(sabqi);
    const sanitizedManzil = sanitizeHtml(manzil);

    // Validate and parse the report date
    const reportDate = date ? new Date(date) : new Date();
    if (isNaN(reportDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Check for duplicate reports for the same date
    const existingReport = await DailyReport.findOne({ studentId, date: reportDate });
    if (existingReport) {
      return res.status(400).json({ success: false, message: "A report already exists for this date" });
    }

    // Calculate condition based on mistakes
    let condition = "Good";
    if (sabaqMistakes > 2) {
      condition = "Below Average";
    } else if (sabaqMistakes > 0) {
      condition = "Medium";
    }

    if (sabqiMistakes > 2) {
      condition = "Below Average";
    } else if (sabqiMistakes > 1) {
      condition = "Medium";
    }

    if (manzilMistakes > 3) {
      condition = "Need Focus";
    } else if (manzilMistakes > 1) {
      condition = "Medium";
    }

    // Create and save the new report
    const newReport = new DailyReport({
      studentId,
      sabaq: sanitizedSabaq,
      sabaqMistakes,
      sabqi: sanitizedSabqi,
      sabqiMistakes,
      manzil: sanitizedManzil,
      manzilMistakes,
      condition,
      attendance,
      date: reportDate,
    });
    await newReport.save();

    // Check weekly performance and send alert if needed
    const hasPoorPerformance = await checkWeeklyPerformance(studentId);
    if (hasPoorPerformance) {
      const student = await Student.findById(studentId); // Fetch student details
      if (student) {
        const alertMessage = `Alert: Student ${student.fullName} (Roll Number: ${student.rollNumber}) is performing below average. Condition: ${condition}`;

        // Send real-time notification to admin
        io.emit("alert", {
          studentName: student.fullName,
          rollNumber: student.rollNumber,
          condition,
          message: alertMessage,
        });

        console.log(alertMessage); // Log the alert to the console
      }
    }

    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch reports for a student with date filter
const getFilteredReports = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Parse and validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Fetch filtered reports
    const reports = await DailyReport.find({
      studentId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching filtered reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch reports for a student
const getReports = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Fetch all reports for the student
    const reports = await DailyReport.find({ studentId }).sort({ date: -1 });
    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch monthly reports for a student
const getMonthlyReports = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Fetch monthly reports
    const reports = await DailyReport.find({
      studentId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch performance data for a student (condition over time)
const getPerformanceData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 100, page = 1 } = req.query; // Add pagination

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Fetch performance data with pagination
    const reports = await DailyReport.find({ studentId })
      .sort({ date: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch para completion data for a student
const getParaCompletionData = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Fetch all reports for the student
    const reports = await DailyReport.find({ studentId });

    // Calculate total lines completed
    let totalLinesCompleted = 0;
    reports.forEach((report) => {
      if (report.sabaq && typeof report.sabaq === "string") {
        totalLinesCompleted += report.sabaq.split(",").length;
      }
    });

    res.status(200).json({ success: true, totalLinesCompleted });
  } catch (error) {
    console.error("Error fetching para completion data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveReport,
  getFilteredReports,
  getReports,
  getMonthlyReports,
  getPerformanceData,
  getParaCompletionData,
};