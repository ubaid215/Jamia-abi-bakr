import { useState, useEffect, useCallback } from "react";
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
  const [estimatedDaysToCompleteQuran, setEstimatedDaysToCompleteQuran] = useState("N/A");
  const [performanceCategory, setPerformanceCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const totalLinesInPara = 288;

  const fetchPerformanceData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/${id}/performance`);
      if (response.data.success) {
        setPerformanceData(response.data.reports);
        setAverageLinesPerDay(response.data.averageLinesPerDay || 0);
        setPerformanceCategory(response.data.performanceCategory || "N/A");
      }
    } catch (error) {
      console.error("Error fetching performance data:", error.response?.data || error.message);
    }
  }, [id]);

  const fetchParaCompletionData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students/${id}/para-completion`);
      if (response.data.success) {
        setTotalLinesCompleted(response.data.totalLinesCompleted || 0);
        setEstimatedDaysToCompleteQuran(response.data.estimatedDaysToCompleteQuran || "N/A");
      }
    } catch (error) {
      console.error("Error fetching para completion data:", error.response?.data || error.message);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPerformanceData();
      await fetchParaCompletionData();
      setLoading(false);
    };
    fetchData();
  }, [fetchPerformanceData, fetchParaCompletionData]);

  if (loading) {
    return <div className="text-center text-lg">Loading analytics...</div>;
  }

  const performanceChartData = {
    labels: performanceData.length > 0 ? performanceData.map(report => new Date(report.date).toLocaleDateString()) : ["No Data"],
    datasets: [
      {
        label: "Condition",
        data: performanceData.length > 0 ? performanceData.map(report => {
          switch (report.condition) {
            case "Good": return 3;
            case "Medium": return 2;
            case "Below Average": return 1;
            case "Need Focus": return 0;
            default: return 0;
          }
        }) : [0],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const paraCompletionData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [totalLinesCompleted, totalLinesInPara - totalLinesCompleted],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const daysToCompletePara = averageLinesPerDay > 0 ? Math.ceil((totalLinesInPara - totalLinesCompleted) / averageLinesPerDay) : "N/A";

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
            <p className="text-lg"><strong>Total Lines Completed:</strong> {totalLinesCompleted} / {totalLinesInPara}</p>
            <p className="text-lg"><strong>Average Lines per Day:</strong> {averageLinesPerDay.toFixed(2)}</p>
            <p className="text-lg"><strong>Estimated Days to Complete Para:</strong> {daysToCompletePara}</p>
            <p className="text-lg"><strong>Estimated Days to Complete Quran:</strong> {estimatedDaysToCompleteQuran}</p>
            <p className="text-lg"><strong>Performance:</strong> {performanceCategory}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Performance Over Time</h3>
        <div className="w-full h-96">
          <Line data={performanceChartData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;