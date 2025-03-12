const express = require("express");
const reportController = require("../controllers/reportController");

const dailyReportRoutes = (io) => {
  const router = express.Router();

  // Save a daily report for a student
  router.post(
    "/:studentId/reports",
    (req, res) => reportController.saveReport(req, res, io)
  );

  // Fetch reports for a student with date filter
  router.get(
    "/:studentId/reports/filter",
    reportController.getFilteredReports
  );

  // Fetch reports for a student
  router.get(
    "/:studentId/reports",
    reportController.getReports
  );

  // Fetch monthly reports for a student
  router.get(
    "/:studentId/reports/monthly",
    reportController.getMonthlyReports
  );

  // Fetch performance data for a student (condition over time)
  router.get(
    "/:studentId/performance",
    reportController.getPerformanceData
  );

  // Fetch para completion data for a student
  router.get(
    "/:studentId/para-completion",
    reportController.getParaCompletionData
  );

  // Fetch students with poor performance
  router.get(
    "/poor-performers",
    reportController.getPoorPerformers
  );

  return router;
};

module.exports = dailyReportRoutes;