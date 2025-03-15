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

const HifzClassesPerformanceGraph = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "weekly", "monthly", "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState(["Hifz-A", "Hifz-B", "Hifz-C"]);

  // Predefined class colors for consistency
  const classColors = {
    "Hifz-A": { border: "rgba(54, 162, 235, 1)", background: "rgba(54, 162, 235, 0.2)" },
    "Hifz-B": { border: "rgba(255, 99, 132, 1)", background: "rgba(255, 99, 132, 0.2)" },
    "Hifz-C": { border: "rgba(75, 192, 192, 1)", background: "rgba(75, 192, 192, 0.2)" }
  };

  // Fetch performance data for all Hifz classes
  const fetchHifzClassesPerformanceData = async () => {
    try {
      setLoading(true);
      const params = { filter };
      if (filter === "custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axios.get(
        "http://localhost:5000/api/students/performance/hifz-classes",
        { params }
      );
      
      if (response.data.success) {
        setPerformanceData(response.data.reportsByClass);
      }
    } catch (error) {
      console.error(
        "Error fetching Hifz classes performance data:",
        error.response?.data || error.message
      );
      setError("Failed to fetch Hifz classes performance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHifzClassesPerformanceData();
  }, [filter, startDate, endDate]);

  // Toggle class selection
  const toggleClassSelection = (classType) => {
    if (selectedClasses.includes(classType)) {
      setSelectedClasses(selectedClasses.filter(c => c !== classType));
    } else {
      setSelectedClasses([...selectedClasses, classType]);
    }
  };

  // Prepare data for the chart
  const chartData = useMemo(() => {
    // Collect all dates across all selected classes
    const allDates = new Set();
    
    // Collect performance data by class and date
    const performanceByClassAndDate = {};
    
    selectedClasses.forEach(classType => {
      if (!performanceData[classType] || performanceData[classType].length === 0) return;
      
      performanceByClassAndDate[classType] = {};
      
      performanceData[classType].forEach(report => {
        const date = new Date(report.date).toLocaleDateString();
        allDates.add(date);
        
        if (!performanceByClassAndDate[classType][date]) {
          performanceByClassAndDate[classType][date] = { total: 0, count: 0 };
        }
        
        performanceByClassAndDate[classType][date].total += report.condition === "Good" ? 3 :
          report.condition === "Medium" ? 2 :
          report.condition === "Below Average" ? 1 : 0;
          
        performanceByClassAndDate[classType][date].count += 1;
      });
    });
    
    // Sort dates chronologically
    const labels = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
    
    // Generate datasets for each selected class
    const datasets = selectedClasses.map(classType => {
      const data = labels.map(date => {
        if (!performanceByClassAndDate[classType] || !performanceByClassAndDate[classType][date]) {
          return null; // No data for this date
        }
        
        const { total, count } = performanceByClassAndDate[classType][date];
        return (total / count).toFixed(2);
      });
      
      return {
        label: `${classType} Performance`,
        data,
        borderColor: classColors[classType].border,
        backgroundColor: classColors[classType].background,
        tension: 0.1,
        pointRadius: 3,
      };
    });

    return { labels, datasets };
  }, [performanceData, selectedClasses]);

  if (loading && Object.keys(performanceData).length === 0) {
    return <div className="text-center text-lg">Loading Hifz classes performance data...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  // Check if there's no data for selected classes
  const hasNoData = selectedClasses.every(classType => 
    !performanceData[classType] || performanceData[classType].length === 0
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Hifz Classes Performance Comparison</h3>
      
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="filter" className="mr-2 font-medium">
            Time Range:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Time</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>
        
        {/* Date Pickers for Custom Filter */}
        {filter === "custom" && (
          <div className="flex gap-3">
            <div>
              <label htmlFor="startDate" className="mr-2 font-medium">
                Start:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="mr-2 font-medium">
                End:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Class Selector */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Select Classes:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(classColors).map(classType => (
            <label key={classType} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedClasses.includes(classType)}
                onChange={() => toggleClassSelection(classType)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span 
                className="ml-2 mr-4 flex items-center"
                style={{ borderLeft: `3px solid ${classColors[classType].border}`, paddingLeft: '8px' }}
              >
                {classType}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="w-full h-96">
        {selectedClasses.length > 0 && !hasNoData ? (
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 3,
                  title: {
                    display: true,
                    text: 'Performance Score'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.dataset.label || '';
                      const value = context.parsed.y;
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex h-full justify-center items-center text-gray-500">
            {selectedClasses.length === 0 
              ? "Please select at least one class to display data"
              : "No performance data available for the selected classes and time period"}
          </div>
        )}
      </div>
      
      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedClasses.map(classType => {
          // Calculate average performance for this class
          let avgPerformance = 0;
          let totalReports = 0;
          
          if (performanceData[classType] && performanceData[classType].length > 0) {
            const total = performanceData[classType].reduce((sum, report) => {
              const value = report.condition === "Good" ? 3 :
                report.condition === "Medium" ? 2 :
                report.condition === "Below Average" ? 1 : 0;
              return sum + value;
            }, 0);
            
            totalReports = performanceData[classType].length;
            avgPerformance = totalReports > 0 ? (total / totalReports).toFixed(2) : 0;
          }
          
          return (
            <div 
              key={classType}
              className="p-4 rounded-lg border"
              style={{ borderColor: classColors[classType].border }}
            >
              <h5 className="font-medium text-lg mb-2">{classType}</h5>
              <p className="text-gray-700">Average Performance: <span className="font-semibold">{avgPerformance}</span></p>
              <p className="text-gray-700">Total Reports: {totalReports}</p>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>Performance Scale:</strong>
          <br />
          3 - Good, 2 - Medium, 1 - Below Average, 0 - Need Focus
        </p>
      </div>
    </div>
  );
};

export default HifzClassesPerformanceGraph;