/* eslint-disable no-case-declarations */
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { id } = useParams();
  const [performanceData, setPerformanceData] = useState([]);
  const [totalLinesCompleted, setTotalLinesCompleted] = useState(0);
  const [averageLinesPerDay, setAverageLinesPerDay] = useState(0);
  const [estimatedDaysToCompleteQuran, setEstimatedDaysToCompleteQuran] =
    useState("N/A");
  const [performanceCategory, setPerformanceCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "weekly", "monthly", "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeError, setDateRangeError] = useState("");
  const totalLinesInPara = 288;

  const fetchPerformanceData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}/performance`
      );
      if (response.data.success) {
        setPerformanceData(response.data.reports);
        setAverageLinesPerDay(response.data.averageLinesPerDay || 0);
        setPerformanceCategory(response.data.performanceCategory || "N/A");
      }
    } catch (error) {
      console.error(
        "Error fetching performance data:",
        error.response?.data || error.message
      );
      setError("Failed to fetch performance data");
    }
  }, [id]);

  const fetchParaCompletionData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}/para-completion`
      );
      if (response.data.success) {
        setTotalLinesCompleted(response.data.totalLinesCompleted || 0);
        setEstimatedDaysToCompleteQuran(
          response.data.estimatedDaysToCompleteQuran || "N/A"
        );
        setAverageLinesPerDay(Number(response.data.averageLinesPerDay) || 0);
      }
    } catch (error) {
      console.error(
        "Error fetching para completion data:",
        error.response?.data || error.message
      );
      setError("Failed to fetch para completion data");
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await fetchPerformanceData();
      await fetchParaCompletionData();
      setLoading(false);
    };
    fetchData();
  }, [fetchPerformanceData, fetchParaCompletionData]);

  // Calculate completed paras and lines in the current para
  const completedParas = Math.floor(totalLinesCompleted / totalLinesInPara);
  const linesInCurrentPara = totalLinesCompleted % totalLinesInPara;

  // Current Para is always the next para (completedParas + 1)
  const currentPara = completedParas + 1;

  // Filter performance data based on the selected filter
  const filteredPerformanceData = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case "weekly":
        return performanceData.filter((report) => {
          const reportDate = new Date(report.date);
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reportDate >= oneWeekAgo;
        });
      case "monthly":
        return performanceData.filter((report) => {
          const reportDate = new Date(report.date);
          const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
          return reportDate >= oneMonthAgo;
        });
      case "custom":
        if (!startDate || !endDate) {
          setDateRangeError("Please select both start and end dates.");
          return performanceData;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
          setDateRangeError("Start date cannot be greater than end date.");
          return performanceData;
        }
        setDateRangeError("");
        return performanceData.filter((report) => {
          const reportDate = new Date(report.date);
          return reportDate >= start && reportDate <= end;
        });
      default:
        return performanceData; // "all" filter
    }
  }, [performanceData, filter, startDate, endDate]);

  const performanceChartData = useMemo(
    () => ({
      labels:
        filteredPerformanceData.length > 0
          ? filteredPerformanceData.map((report) =>
              new Date(report.date).toLocaleDateString()
            )
          : ["No Data"],
      datasets: [
        {
          label: "Condition",
          data:
            filteredPerformanceData.length > 0
              ? filteredPerformanceData.map((report) => {
                  switch (report.condition) {
                    case "Good":
                      return 3;
                    case "Medium":
                      return 2;
                    case "Below Average":
                      return 1;
                    case "Need Focus":
                      return 0;
                    default:
                      return 0;
                  }
                })
              : [0],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    }),
    [filteredPerformanceData]
  );

  const paraCompletionData = useMemo(
    () => ({
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [linesInCurrentPara, totalLinesInPara - linesInCurrentPara],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    }),
    [linesInCurrentPara, totalLinesInPara]
  );

  const daysToCompletePara = useMemo(() => {
    if (averageLinesPerDay > 0) {
      return Math.ceil(
        (totalLinesInPara - linesInCurrentPara) / averageLinesPerDay
      );
    }
    return "N/A";
  }, [averageLinesPerDay, linesInCurrentPara, totalLinesInPara]);

  // Reset filter to "All Time" and clear date inputs
  const resetFilter = () => {
    setFilter("all");
    setStartDate("");
    setEndDate("");
    setDateRangeError("");
  };

  if (loading) {
    return <div className="text-center text-lg">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Student Analytics</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Para Completion Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-64">
            <Doughnut data={paraCompletionData} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg">
              <strong>Total Lines Completed:</strong> {totalLinesCompleted}
            </p>
            <p className="text-lg">
              <strong>Completed Paras:</strong> {completedParas}
            </p>
            <p className="text-lg">
              <strong>Current Para:</strong> {currentPara}
            </p>
            <p className="text-lg">
              <strong>Lines in Current Para:</strong> {linesInCurrentPara} /{" "}
              {totalLinesInPara}
            </p>
            <p className="text-lg">
              <strong>Average Lines per Day:</strong>{" "}
              {averageLinesPerDay.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Estimated Days to Complete Current Para:</strong>{" "}
              {daysToCompletePara}
            </p>
            <p className="text-lg">
              <strong>Estimated Days to Complete Quran:</strong>{" "}
              {estimatedDaysToCompleteQuran}
            </p>
            <p className="text-lg">
              <strong>Performance:</strong> {performanceCategory}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Performance Over Time</h3>
        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Date Range</option>
          </select>
          {/* Reset Filter Button */}
          {filter === "custom" && (
            <button
              onClick={resetFilter}
              className="ml-4 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset Filter
            </button>
          )}
        </div>
        {/* Date Pickers for Custom Filter */}
        {filter === "custom" && (
          <div className="mb-4">
            <label htmlFor="startDate" className="mr-2">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <label htmlFor="endDate" className="ml-4 mr-2">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            {/* Date Range Error Message */}
            {dateRangeError && (
              <p className="text-sm text-red-500 mt-2">{dateRangeError}</p>
            )}
          </div>
        )}
        <div className="w-full h-96">
          <Line data={performanceChartData} />
        </div>
        {/* Minimal Explanation Box */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Performance Scale:</strong>
            <br />
            3 - Good, 2 - Medium, 1 - Below Average, 0 - Need Focus
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;