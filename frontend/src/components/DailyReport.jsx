/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { urduFontBase64 } from "./fonts";

const DailyReport = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Set default date to today
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
  // Add language state
  const [language, setLanguage] = useState("english"); // Default to English

  // Translations for table headers and other UI elements
  const translations = {
    english: {
      title: "Jamia Abi Bakar (R.A)",
      studentName: "Student Name",
      rollNumber: "Roll Number",
      teacherName: "Teacher Name",
      startDate: "Start Date",
      endDate: "End Date",
      filterReports: "Filter Reports",
      month: "Month",
      year: "Year",
      filter: "Filter",
      bulkUpload: "Bulk Upload Reports (CSV/Excel)",
      exportToPDF: "Export to PDF",
      attendance: "Attendance",
      present: "Present",
      absent: "Absent",
      leave: "Leave",
      sabaq: "Sabaq lines",
      sabaqMistakes: "Sabaq Mistakes",
      sabqi: "Sabqi",
      sabqiMistakes: "Sabqi Mistakes",
      manzil: "Manzil",
      manzilMistakes: "Manzil Mistakes",
      date: "Date",
      addReport: "Add Report",
      updateReport: "Update Report",
      condition: "Condition",
      actions: "Actions",
      edit: "Edit",
      // Month names
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      selectMonth: "Select Month",
      selectYear: "Select Year",
      toggleLanguage: "Switch to Urdu",
    },
    urdu: {
      title: "جامعہ ابی بکر (رض)",
      studentName: "طالب علم کا نام",
      rollNumber: "رول نمبر",
      teacherName: "استاد کا نام",
      startDate: "شروع کی تاریخ",
      endDate: "اختتامی تاریخ",
      filterReports: "رپورٹس فلٹر کریں",
      month: "مہینہ",
      year: "سال",
      filter: "فلٹر",
      bulkUpload: "بلک اپلوڈ رپورٹس (CSV/Excel)",
      exportToPDF: "PDF میں برآمد کریں",
      attendance: "حاضری",
      present: "موجود",
      absent: "غیر حاضر",
      leave: "چھٹی",
      sabaq: "سبق",
      sabaqMistakes: "سبق کی غلطیاں",
      sabqi: "سبقی",
      sabqiMistakes: "سبقی کی غلطیاں",
      manzil: "منزل",
      manzilMistakes: "منزل کی غلطیاں",
      date: "تاریخ",
      addReport: "رپورٹ شامل کریں",
      updateReport: "رپورٹ اپڈیٹ کریں",
      condition: "حالت",
      actions: "کارروائیاں",
      edit: "ترمیم",
      // Month names
      january: "جنوری",
      february: "فروری",
      march: "مارچ",
      april: "اپریل",
      may: "مئی",
      june: "جون",
      july: "جولائی",
      august: "اگست",
      september: "ستمبر",
      october: "اکتوبر",
      november: "نومبر",
      december: "دسمبر",
      selectMonth: "مہینہ منتخب کریں",
      selectYear: "سال منتخب کریں",
      toggleLanguage: "انگریزی میں تبدیل کریں",
    }
  };

  // Helper function to get translation for the current language
  const t = (key) => translations[language][key] || key;

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

      // If attendance is "Absent" or "Leave," clear other fields
      const reportData = {
        ...formData,
        date: formData.date || new Date().toISOString().split("T")[0], // Use current date if no date is provided
        sabaq: formData.attendance === "Present" ? formData.sabaq : "",
        sabaqMistakes: formData.attendance === "Present" ? formData.sabaqMistakes : 0,
        sabqi: formData.attendance === "Present" ? formData.sabqi : "",
        sabqiMistakes: formData.attendance === "Present" ? formData.sabqiMistakes : 0,
        manzil: formData.attendance === "Present" ? formData.manzil : "",
        manzilMistakes: formData.attendance === "Present" ? formData.manzilMistakes : 0,
      };

      const response = await axios[method](endpoint, reportData);

      if (response.data.success) {
        fetchReportsByMonth(); // Refresh the reports
        setFormData({
          date: new Date().toISOString().split("T")[0],
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

  // Toggle language between English and Urdu
  const toggleLanguage = () => {
    setLanguage(language === "english" ? "urdu" : "english");
  };

  // Export to PDF (now with language support)
  const exportToPDF = async () => {
    const doc = new jsPDF();
  
    // Load Urdu font if language is Urdu
    if (language === "urdu") {
      try {
        // Add Noto Nastaliq Urdu font from Base64
        doc.addFileToVFS("NotoNastaliqUrdu-Regular.ttf", urduFontBase64);
        doc.addFont("NotoNastaliqUrdu-Regular.ttf", "NotoNastaliqUrdu", "normal");
        doc.setFont("NotoNastaliqUrdu");
      } catch (error) {
        console.error("Error loading Urdu font:", error);
        alert("Failed to load Urdu font. Falling back to English.");
      }
    }
  
    // Generate the PDF
    generatePDF(doc);
  };
  
  // Helper function to generate the PDF
  const generatePDF = (doc) => {
    // Set text direction for Urdu
    const textDirection = language === "urdu" ? "rtl" : "ltr";
  
    // Add title
    doc.setFontSize(18);
    doc.text(t("title"), 105, 10, { align: "center" });
    doc.setFontSize(14);
    doc.text(`${t("studentName")}: ${student.fullName}`, 105, 20, { align: "center" });
    doc.text(`${t("rollNumber")}: ${student.rollNumber}`, 150, 30, {
      align: "left",
    });
    doc.text(`${t("teacherName")}: ${student.teacherName}`, 95, 30, {
      align: "right",
    });
  
    // Add table using autoTable
    autoTable(doc, {
      startY: 40,
      head: [
        [
          t("date"),
          t("sabaq"),
          t("sabaqMistakes"),
          t("sabqi"),
          t("sabqiMistakes"),
          t("manzil"),
          t("manzilMistakes"),
          t("condition"),
          t("attendance"),
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
      // Add RTL support for Urdu
      styles: {
        direction: textDirection,
      },
    });
  
    // Save PDF with language indicator
    const filename = language === "urdu" ? "daily_reports_urdu.pdf" : "daily_reports.pdf";
    doc.save(filename);
  };

  // Fetch student details and reports on component mount
  useEffect(() => {
    fetchStudentDetails();
    fetchReportsByMonth(); // Fetch reports for the current month
  }, [id]);

  // Create a function to render month options based on current language
  const renderMonthOptions = () => {
    const monthsData = [
      { value: "01", english: "January", urdu: "جنوری" },
      { value: "02", english: "February", urdu: "فروری" },
      { value: "03", english: "March", urdu: "مارچ" },
      { value: "04", english: "April", urdu: "اپریل" },
      { value: "05", english: "May", urdu: "مئی" },
      { value: "06", english: "June", urdu: "جون" },
      { value: "07", english: "July", urdu: "جولائی" },
      { value: "08", english: "August", urdu: "اگست" },
      { value: "09", english: "September", urdu: "ستمبر" },
      { value: "10", english: "October", urdu: "اکتوبر" },
      { value: "11", english: "November", urdu: "نومبر" },
      { value: "12", english: "December", urdu: "دسمبر" }
    ];
    
    return (
      <>
        <option value="">{t("selectMonth")}</option>
        {monthsData.map(month => (
          <option key={month.value} value={month.value}>
            {language === "english" ? month.english : month.urdu}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className={`p-6 w-[50vw] bg-white shadow-lg rounded-lg ${language === "urdu" ? "rtl" : "ltr"}`}>
      {/* Language Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {t("toggleLanguage")}
        </button>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-3xl font-bold text-center mb-4">
        {t("title")}
      </h1>

      {/* Student Name and Roll Number */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">{student.fullName}</h2>
        <p className="text-lg text-gray-600">
          {t("rollNumber")}: {student.rollNumber}
        </p>
        <p className="text-lg text-gray-600">
          {t("teacherName")}: {student.teacherName}
        </p>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          {t("startDate")}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700 mt-4">
          {t("endDate")}
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
          {t("filterReports")}
        </button>
      </div>

      {/* Month Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">{t("month")}</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {renderMonthOptions()}
        </select>
        <label className="block text-sm font-medium text-gray-700 mt-4">
          {t("year")}
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t("selectYear")}</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          {/* Add more years */}
        </select>
        <button
          onClick={fetchReportsByMonth}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t("filter")}
        </button>
      </div>

      {/* Bulk Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          {t("bulkUpload")}
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
        {t("exportToPDF")}
      </button>

      {/* Form to add/edit daily report */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("attendance")}
            </label>
            <select
              name="attendance"
              value={formData.attendance}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Present">{t("present")}</option>
              <option value="Absent">{t("absent")}</option>
              <option value="Leave">{t("leave")}</option>
            </select>
          </div>

          {/* Conditional Fields (Only shown if attendance is "Present") */}
          {formData.attendance === "Present" && (
            <>
              {/* Sabaq Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("sabaq")}
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
                  {t("sabaqMistakes")}
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
                  {t("sabqi")}
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
                  {t("sabqiMistakes")}
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
                  {t("manzil")}
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
                  {t("manzilMistakes")}
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
            </>
          )}

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("date")}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString()} // Prevent future dates
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editReportId ? t("updateReport") : t("addReport")}
        </button>
      </form>

      {/* Table to display reports */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("date")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("sabaq")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("sabaqMistakes")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("sabqi")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("sabqiMistakes")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("manzil")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("manzilMistakes")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("condition")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("attendance")}
              </th>
              <th className="px-6 py-3 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("actions")}
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