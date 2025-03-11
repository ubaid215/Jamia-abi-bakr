/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const DailyReport = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [formData, setFormData] = useState({
    date: "",
    sabaq: "",
    sabaqMistakes: 0,
    sabqi: "",
    sabqiMistakes: 0,
    manzil: "",
    manzilMistakes: 0,
    attendance: "Present",
  });
  const [reports, setReports] = useState([]);
  const [editReportId, setEditReportId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [student, setStudent] = useState({ fullName: "", rollNumber: "" }); // State for student details
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "2-digit" })
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );
      if (response.data.success) {
        setStudent(response.data.student); // Set student details
      }
    } catch (error) {
      console.error(
        "Error fetching student details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fetch daily reports for the student
  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}/reports`
      );
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error(
        "Error fetching reports:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fetch filtered reports by date range
  const fetchFilteredReports = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}/reports/filter`,
        {
          params: { startDate, endDate },
        }
      );
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error(
        "Error fetching filtered reports:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fetch reports by month
  const fetchReportsByMonth = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}/reports/monthly`,
        {
          params: { month: selectedMonth, year: selectedYear },
        }
      );
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports by month:", error);
      alert("Failed to fetch reports. Please try again.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editReportId
        ? `http://localhost:5000/api/students/${id}/reports/${editReportId}`
        : `http://localhost:5000/api/students/${id}/reports`;

      const method = editReportId ? "put" : "post";

      const response = await axios[method](endpoint, formData);

      if (response.data.success) {
        fetchReportsByMonth(); // Refresh the reports
        setFormData({
          date: "",
          sabaq: "",
          sabaqMistakes: 0,
          sabqi: "",
          sabqiMistakes: 0,
          manzil: "",
          manzilMistakes: 0,
          attendance: "Present",
        });
        setEditReportId(null);
      }
    } catch (error) {
      console.error(
        "Error saving report:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle edit button click
  const handleEditClick = (report) => {
    setEditReportId(report._id);
    setFormData({
      date: report.date
        ? new Date(report.date).toISOString().split("T")[0]
        : "",
      sabaq: report.sabaq,
      sabaqMistakes: report.sabaqMistakes,
      sabqi: report.sabqi,
      sabqiMistakes: report.sabqiMistakes,
      manzil: report.manzil,
      manzilMistakes: report.manzilMistakes,
      attendance: report.attendance,
    });
  };

  // Handle bulk upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          `http://localhost:5000/api/students/${id}/reports/bulk`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          alert("Reports uploaded successfully!");
          fetchReportsByMonth(); // Refresh the reports
        }
      } catch (error) {
        console.error("Error uploading reports:", error);
        alert("Failed to upload reports. Please try again.");
      }
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Jamia Abi Bakar (R.A)", 105, 10, { align: "center" });
    doc.setFontSize(14);
    doc.text(`Student Name: ${student.fullName}`, 105, 20, { align: "center" });
    doc.text(`Roll Number: ${student.rollNumber}`, 105, 30, {
      align: "center",
    });

    // Add table using autoTable
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Date",
          "Sabaq",
          "Sabaq Mistakes",
          "Sabqi",
          "Sabqi Mistakes",
          "Manzil",
          "Manzil Mistakes",
          "Condition",
          "Attendance",
        ],
      ],
      body: reports.map((report) => [
        new Date(report.date).toLocaleDateString(),
        report.sabaq,
        report.sabaqMistakes,
        report.sabqi,
        report.sabqiMistakes,
        report.manzil,
        report.manzilMistakes,
        report.condition,
        report.attendance,
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      theme: "grid",
    });

    // Save PDF
    doc.save("daily_reports.pdf");
  };

  // Fetch student details and reports on component mount
  useEffect(() => {
    fetchStudentDetails();
    fetchReportsByMonth(); // Fetch reports for the current month
  }, [id]);

  return (
    <div className="p-6 w-[50vw] bg-white shadow-lg rounded-lg">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-center mb-4">
        Jamia Abi Bakar (R.A)
      </h1>

      {/* Student Name and Roll Number */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">{student.fullName}</h2>
        <p className="text-lg text-gray-600">
          Roll Number: {student.rollNumber}
        </p>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={fetchFilteredReports}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Filter Reports
        </button>
      </div>

      {/* Month Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Month</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
          {/* Add all months */}
        </select>
        <label className="block text-sm font-medium text-gray-700 mt-4">
          Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          {/* Add more years */}
        </select>
        <button
          onClick={fetchReportsByMonth}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Filter
        </button>
      </div>

      {/* Bulk Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Bulk Upload Reports (CSV/Excel)
        </label>
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleBulkUpload}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Export to PDF Button */}
      <button
        onClick={exportToPDF}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Export to PDF
      </button>

      {/* Form to add/edit daily report */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attendance
            </label>
            <select
              name="attendance"
              value={formData.attendance}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          {/* Sabaq Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sabaq
            </label>
            <input
              type="text"
              name="sabaq"
              value={formData.sabaq}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Sabaq Mistakes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sabaq Mistakes
            </label>
            <input
              type="number"
              name="sabaqMistakes"
              value={formData.sabaqMistakes}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Sabqi Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sabqi
            </label>
            <input
              type="text"
              name="sabqi"
              value={formData.sabqi}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Sabqi Mistakes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sabqi Mistakes
            </label>
            <input
              type="number"
              name="sabqiMistakes"
              value={formData.sabqiMistakes}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Manzil Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manzil
            </label>
            <input
              type="text"
              name="manzil"
              value={formData.manzil}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Manzil Mistakes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manzil Mistakes
            </label>
            <input
              type="number"
              name="manzilMistakes"
              value={formData.manzilMistakes}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editReportId ? "Update Report" : "Add Report"}
        </button>
      </form>

      {/* Table to display reports */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sabaq
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sabaq Mistakes
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sabqi
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sabqi Mistakes
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manzil
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manzil Mistakes
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.sabaq}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.sabaqMistakes}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.sabqi}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.sabqiMistakes}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.manzil}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.manzilMistakes}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.condition}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  {report.attendance}
                </td>
                <td className="px-6 py-4 border border-gray-300 text-center text-sm text-gray-900">
                  <button
                    onClick={() => handleEditClick(report)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyReport;
