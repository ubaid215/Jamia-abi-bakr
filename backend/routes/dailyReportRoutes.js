const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const reportMiddleware = require("../middleware/reportMiddleware");

// Save a daily report for a student
router.post(
  "/:studentId/reports",
  reportMiddleware.validateStudentId,
  reportMiddleware.validateReportDate,
  reportController.saveReport
);

// Fetch reports for a student with date filter
router.get(
  "/:studentId/reports/filter",
  reportMiddleware.validateStudentId,
  reportController.getFilteredReports
);

// Fetch reports for a student
router.get(
  "/:studentId/reports",
  reportMiddleware.validateStudentId,
  reportController.getReports
);

// Fetch monthly reports for a student
router.get(
  "/:studentId/reports/monthly",
  reportMiddleware.validateStudentId,
  reportController.getMonthlyReports
);

// Fetch performance data for a student (condition over time)
router.get(
  "/:studentId/performance",
  reportMiddleware.validateStudentId,
  reportController.getPerformanceData
);



// Fetch para completion data for a student
router.get(
  "/:studentId/para-completion",
  reportMiddleware.validateStudentId,
  reportController.getParaCompletionData
);

// Fetch students with poor performance
router.get("/poor-performers", reportController.getPoorPerformers);

module.exports = router;