const DailyReport = require("../models/DailyReport");
const Student = require("../models/Student");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");

// Helper function to check weekly performance
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

// Fetch students with poor performance
const getPoorPerformers = async (req, res) => {
  try {
    console.log("Fetching poor performers...");
    const allStudents = await Student.find(); // Fetch all students
    console.log(`Found ${allStudents.length} total students`);
    
    const poorPerformers = [];

    // Check each student's performance
    for (const student of allStudents) {
      const hasPoorPerformance = await checkWeeklyPerformance(student._id);
      if (hasPoorPerformance) {
        poorPerformers.push(student);
      }
    }
    
    console.log(`Found ${poorPerformers.length} poor performers`);
    res.status(200).json({ success: true, students: poorPerformers });
  } catch (error) {
    console.error("Error in getPoorPerformers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save a daily report for a student
const saveReport = async (req, res, io) => {
  try {
    const { studentId } = req.params;
    const { date, sabaq, sabaqMistakes, sabqi, sabqiMistakes, manzil, manzilMistakes, attendance } = req.body;

    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Validate required fields for "Present" attendance
    if (attendance === "Present") {
      if (!sabaq || !sabqi || !manzil || sabaqMistakes === undefined || sabqiMistakes === undefined || manzilMistakes === undefined) {
        return res.status(400).json({ success: false, message: "All fields are required for 'Present' attendance" });
      }
    }

    // Sanitize inputs (only if attendance is "Present")
    const sanitizedSabaq = attendance === "Present" ? sanitizeHtml(sabaq) : "";
    const sanitizedSabqi = attendance === "Present" ? sanitizeHtml(sabqi) : "";
    const sanitizedManzil = attendance === "Present" ? sanitizeHtml(manzil) : "";

    // Validate and parse the report date
    const reportDate = date ? new Date(date).toISOString() : new Date().toISOString();
    if (isNaN(new Date(reportDate).getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Check for duplicate reports for the same date
    const existingReport = await DailyReport.findOne({ studentId, date: reportDate });
    if (existingReport) {
      return res.status(400).json({ success: false, message: "A report already exists for this date" });
    }

    // Calculate condition based on mistakes (only for "Present" attendance)
    let condition = "Good";
    if (attendance === "Present") {
      if (sabaqMistakes > 2 || sabqiMistakes > 2 || manzilMistakes > 3) {
        condition = "Below Average";
      } else if (sabaqMistakes > 0 || sabqiMistakes > 1 || manzilMistakes > 1) {
        condition = "Medium";
      }
    } else {
      condition = "N/A"; // No condition for "Absent" or "Leave"
    }

    // Create and save the new report
    const newReport = new DailyReport({
      studentId,
      sabaq: sanitizedSabaq,
      sabaqMistakes: attendance === "Present" ? sabaqMistakes : 0,
      sabqi: sanitizedSabqi,
      sabqiMistakes: attendance === "Present" ? sabqiMistakes : 0,
      manzil: sanitizedManzil,
      manzilMistakes: attendance === "Present" ? manzilMistakes : 0,
      condition,
      attendance,
      date: reportDate,
    });
    await newReport.save();

    // Check weekly performance and send alert if needed (only for "Present" attendance)
    if (attendance === "Present") {
      const hasPoorPerformance = await checkWeeklyPerformance(studentId);
      if (hasPoorPerformance && (condition === "Below Average" || condition === "Need Focus")) {
        const student = await Student.findById(studentId); // Fetch student details
        if (student) {
          const alertMessage = `Alert: Student ${student.fullName} (Roll Number: ${student.rollNumber}) is performing below average. Condition: ${condition}`;

          // FIXED: Changed event name to "poorPerformerAlert" to match frontend
          io.emit("poorPerformerAlert", {
            studentName: student.fullName,
            rollNumber: student.rollNumber,
            condition,
            message: alertMessage,
          });

          console.log(alertMessage); // Log the alert to the console
        }
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
    const { limit = 100, page = 1 } = req.query;

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
      if (report.sabaq) {
        // Convert sabaq to a number if it's a string
        const sabaqLines = Number(report.sabaq);
        if (!isNaN(sabaqLines)) {
          totalLinesCompleted += sabaqLines;
        }
      }
    });

    // Calculate average lines per day
    const totalDays = reports.length;
    const averageLinesPerDay = totalDays > 0 ? totalLinesCompleted / totalDays : 0;

    // Estimate days to complete the Quran (assuming 604 pages and 15 lines per page)
    const totalLinesInQuran = 604 * 15; // Adjust this based on your Quran's line count
    const estimatedDaysToCompleteQuran =
      averageLinesPerDay > 0
        ? Math.ceil((totalLinesInQuran - totalLinesCompleted) / averageLinesPerDay)
        : "N/A";

    res.status(200).json({
      success: true,
      totalLinesCompleted,
      averageLinesPerDay,
      estimatedDaysToCompleteQuran,
    });
  } catch (error) {
    console.error("Error fetching para completion data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Fetch performance data for Hifz students
const hifzPerformance = async (req, res) => {
  try {
    // Fetch students with classType = "Hifz"
    const hifzStudents = await Student.find({ classType: { $in: ["Hifa-A", "Hifz-B"] } });
    if (hifzStudents.length === 0) {
      return res.status(404).json({ success: false, message: "No Hifz students found" });
    }

    const studentIds = hifzStudents.map((student) => student._id);

    // Fetch performance reports for Hifz students
    const reports = await DailyReport.find({ studentId: { $in: studentIds } }).sort({ date: 1 });
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch performance data for all Hifz classes
const allHifzClassesPerformance = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    
    // Get all Hifz students
    const hifzStudents = await Student.find({
      classType: { $in: ["Hifz-A", "Hifz-B", "Hifz-C"] }
    }, { 
      _id: 1, 
      fullName: 1, 
      classType: 1 
    });
    
    if (hifzStudents.length === 0) {
      return res.status(404).json({ success: false, message: "No Hifz students found" });
    }
    
    // Extract student IDs and create a map for class lookup
    const studentIds = hifzStudents.map(student => student._id);
    const studentClassMap = {};
    
    hifzStudents.forEach(student => {
      studentClassMap[student._id.toString()] = {
        classType: student.classType,
        fullName: student.fullName
      };
    });
    
    // Build report query with date filters if needed
    let reportQuery = { studentId: { $in: studentIds } };
    
    if (filter === "custom" && startDate && endDate) {
      reportQuery.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else if (filter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      reportQuery.date = { $gte: oneWeekAgo };
    } else if (filter === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      reportQuery.date = { $gte: oneMonthAgo };
    }
    
    // Fetch reports
    const reports = await DailyReport.find(reportQuery).sort({ date: 1 });
    
    // Group reports by Hifz class type
    const reportsByClass = {
      "Hifz-A": [],
      "Hifz-B": [],
      "Hifz-C": []
    };
    
    reports.forEach(report => {
      const studentId = report.studentId.toString();
      const studentInfo = studentClassMap[studentId];
      
      if (studentInfo) {
        const classType = studentInfo.classType;
        
        // Add report with student name for reference
        reportsByClass[classType].push({
          ...report.toObject(),
          studentName: studentInfo.fullName
        });
      }
    });
    
    res.status(200).json({ 
      success: true, 
      reportsByClass 
    });
  } catch (error) {
    console.error("Error fetching Hifz classes performance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { studentId, reportId } = req.params;
    const updateData = req.body;

    // Validate student ID and report ID
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(reportId)
    ) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    // Calculate condition based on mistakes (only for "Present" attendance)
    let condition = "Good";
    if (updateData.attendance === "Present") {
      if (
        updateData.sabaqMistakes > 2 ||
        updateData.sabqiMistakes > 2 ||
        updateData.manzilMistakes > 3
      ) {
        condition = "Below Average";
      } else if (
        updateData.sabaqMistakes > 0 ||
        updateData.sabqiMistakes > 1 ||
        updateData.manzilMistakes > 1
      ) {
        condition = "Medium";
      }
    } else {
      condition = "N/A"; // No condition for "Absent" or "Leave"
    }

    // Add the calculated condition to the updateData
    updateData.condition = condition;

    // Find and update the report
    const updatedReport = await DailyReport.findOneAndUpdate(
      { _id: reportId, studentId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, report: updatedReport });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Export all functions
module.exports = {
  saveReport,
  getFilteredReports,
  getReports,
  getMonthlyReports,
  getPerformanceData,
  getParaCompletionData,
  getPoorPerformers,
  hifzPerformance,
  allHifzClassesPerformance,
  updateReport
};