/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedClassType, setSelectedClassType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(6);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch teachers with token
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage

        if (!token) {
          // Redirect to login if no token is found
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/teachers", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        setTeachers(response.data);
        setFilteredTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);

        // Handle token expiry or invalid token
        if (error.response?.status === 401) {
          localStorage.removeItem("token"); // Clear the invalid token
          navigate("/login"); // Redirect to the login page
        } else {
          setError("Failed to fetch teachers. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [navigate]);

  // Filter teachers based on class type and search term
  useEffect(() => {
    let filtered = teachers;
    if (selectedClassType) {
      filtered = filtered.filter((teacher) => teacher.classType === selectedClassType);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.cnic.includes(searchTerm) ||
          teacher.phoneNumber.includes(searchTerm)
      );
    }
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [selectedClassType, searchTerm, teachers]);

  // Get unique class types for the filter dropdown
  const uniqueClassTypes = [...new Set(teachers.map((teacher) => teacher.classType))];

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to open CV in a new window
  const openCVInNewWindow = (cvUrl) => {
    window.open(cvUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">All Teachers</h2>

        {/* Go Back Button */}
        <Link to="/">
          <button className="bg-white cursor-pointer text-center w-48 mb-5 rounded-2xl h-14 relative text-black text-xl font-semibold group">
            <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000" />
                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000" />
              </svg>
            </div>
            <p className="translate-x-2">Go Back</p>
          </button>
        </Link>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700">Filter by Class Type</label>
            <select
              value={selectedClassType}
              onChange={(e) => setSelectedClassType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Class Types</option>
              {uniqueClassTypes.map((classType, index) => (
                <option key={index} value={classType}>
                  {classType}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-2/3">
            <label className="block text-sm font-medium text-gray-700">Search by Name, CNIC, or Phone</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredTeachers.length === 0 ? (
          <p className="text-center text-gray-600">No teachers found.</p>
        ) : (
          <>
            {/* Teachers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTeachers.map((teacher) => (
                <div key={teacher._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">{teacher.fullName}</h3>
                    <p className="text-sm text-gray-600">{teacher.fatherName}</p>
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <p className="text-sm">
                      <strong>CNIC:</strong> {teacher.cnic}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {teacher.phoneNumber}
                    </p>
                    <p className="text-sm">
                      <strong>Address:</strong> {teacher.address}
                    </p>
                    <p className="text-sm">
                      <strong>Class Type:</strong> {teacher.classType}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50">
                    <button
                      onClick={() => openCVInNewWindow(`http://localhost:5000/${teacher.cv}`)}
                      className="text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                    >
                      View CV
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">See Details</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="mx-4 self-center">
                Page {currentPage} of {Math.ceil(filteredTeachers.length / teachersPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredTeachers.length / teachersPerPage)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllTeachers;