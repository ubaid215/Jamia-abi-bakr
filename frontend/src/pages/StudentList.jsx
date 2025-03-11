/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter
  const [classFilter, setClassFilter] = useState(""); // State for class filter
  const [sortBy, setSortBy] = useState(""); // State for sorting
  const navigate = useNavigate();

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students?page=${currentPage}&limit=${studentsPerPage}&search=${searchTerm}&startDate=${startDate}&endDate=${endDate}&classType=${classFilter}&sortBy=${sortBy}`
      );
      if (response.data && response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Invalid data format");
      }
    } catch (error) {
      setError("Error fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when filters or pagination changes
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, studentsPerPage, searchTerm, startDate, endDate, classFilter, sortBy]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle date range filter
  const handleDateFilter = () => {
    setCurrentPage(1); // Reset to the first page when applying date filter
    fetchStudents();
  };

  // Handle class filter
  const handleClassFilter = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page when applying class filter
  };

  // Handle sorting
  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to the first page when applying sorting
  };

  // Handle student deletion
  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/students/${studentId}`);
      if (response.data && response.data.success) {
        // Remove the deleted student from the list
        setStudents(students.filter((student) => student._id !== studentId));
      } else {
        setError("Failed to delete student");
      }
    } catch (error) {
      setError("Error deleting student: " + error.message);
    }
  };

  // Display loading or error messages
  if (loading) {
    return <p className="text-center mt-8">Loading students...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Student List</h2>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name or admission number"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg flex-1"
          />

          {/* Date Range Filter */}
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleDateFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Filter
            </button>
          </div>

          {/* Class Filter Dropdown */}
          <select
            value={classFilter}
            onChange={handleClassFilter}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Classes</option>
            <option value="Hifz">Hifz</option>
            <option value="Nazra">Nazra</option>
            <option value="Dars-e-Nizami">Dars-e-Nizami</option>
            <option value="Academic">Academic</option>
          </select>

          {/* Sorting Dropdown */}
          <select
            value={sortBy}
            onChange={handleSort}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Sort By</option>
            <option value="fullName">Name (A-Z)</option>
            <option value="-fullName">Name (Z-A)</option>
            <option value="dateOfAdmission">Admission Date (Oldest)</option>
            <option value="-dateOfAdmission">Admission Date (Newest)</option>
          </select>
        </div>

        {/* Display Students */}
        {students.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Top Section: Three-Dot Menu */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Admission No:{" "}
                    <span className="font-medium">
                      {student.admissionNumber}
                    </span>
                  </p>
                  <div className="relative">
                    {/* Three-Dot Menu Button */}
                    <button
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      onClick={() => {
                        // Toggle dropdown visibility
                        const dropdown = document.getElementById(`dropdown-${student._id}`);
                        dropdown.classList.toggle("hidden");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      id={`dropdown-${student._id}`}
                      className="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Image, Name, and Class */}
                <div className="p-4 flex flex-col items-center text-center">
                  <img
                    src={`http://localhost:5000${student.profileImage}`} // Use backend image URL
                    alt={student.fullName}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {student.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Class: {student.classType}
                  </p>
                </div>

                {/* Lower Section: See Details Button */}
                <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-300"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors duration-300"
          >
            Previous
          </button>
          <span className="mx-4 self-center text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentList;