/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AllStudentsPerformanceGraph = () => {
  const [allStudentsPerformanceData, setAllStudentsPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "weekly", "monthly", "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch performance data for Hifz students
  const fetchHifzStudentsPerformanceData = async () => {
    try {
      const params = { filter };
      if (filter === "custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axios.get(
        "http://localhost:5000/api/students/performance/hifz",
        { params }
      );
      if (response.data.success) {
        setAllStudentsPerformanceData(response.data.reports);
      }
    } catch (error) {
      console.error(
        "Error fetching Hifz students performance data:",
        error.response?.data || error.message
      );
      setError("Failed to fetch Hifz students performance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHifzStudentsPerformanceData();
  }, [filter, startDate, endDate]);

  // Prepare data for the chart
  const allStudentsChartData = useMemo(() => {
    const labels = [];
    const datasets = [];

    // Group data by date and calculate average performance
    const performanceByDate = {};
    allStudentsPerformanceData.forEach((report) => {
      const date = new Date(report.date).toLocaleDateString();
      if (!performanceByDate[date]) {
        performanceByDate[date] = { total: 0, count: 0 };
      }
      performanceByDate[date].total += report.condition === "Good" ? 3 :
        report.condition === "Medium" ? 2 :
        report.condition === "Below Average" ? 1 : 0;
      performanceByDate[date].count += 1;
    });

    // Prepare labels and dataset
    Object.keys(performanceByDate).forEach((date) => {
      labels.push(date);
      datasets.push((performanceByDate[date].total / performanceByDate[date].count).toFixed(2));
    });

    return {
      labels,
      datasets: [
        {
          label: "Average Performance (Hifz Students)",
          data: datasets,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };
  }, [allStudentsPerformanceData]);

  if (loading) {
    return <div className="text-center text-lg">Loading Hifz students performance data...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Hifz Students Performance Over Time</h3>
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
        {/* Date Pickers for Custom Filter */}
        {filter === "custom" && (
          <div className="mt-4">
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
          </div>
        )}
      </div>
      <div className="w-full h-96">
        <Line data={allStudentsChartData} />
      </div>
      {/* Minimal Explanation Box */}
      <div className=" p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>Performance Scale:</strong>
          <br />
          3 - Good, 2 - Medium, 1 - Below Average, 0 - Need Focus
        </p>
      </div>
    </div>
  );
};

export default AllStudentsPerformanceGraph;