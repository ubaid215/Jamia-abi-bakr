import { FaChalkboardTeacher, FaPlus, FaSearch } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import Header from "../layout/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import HifzClassesPerformanceGraph from "../HifzClassesPerformanceGraph";
import PoorPerformersList from "../Students/PoorPerformersList";


const Dashboard = () => {
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch random Ayah on component mount
  useEffect(() => {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,ur.junagarhi`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const arabicText = data.data[0].text;
          const translation = data.data[1].text;
          const surahName = data.data[0].surah.englishName;
          const verseNumber = data.data[0].numberInSurah;
          setAyah({ arabicText, translation, surahName, verseNumber });
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Fetch total number of students and teachers
 // In your useEffect that fetches data:
 useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("Attempting to fetch student and teacher counts...");
      
      const [studentsResponse, teachersResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/students/count"),
        axios.get("http://localhost:5000/api/teachers/count")
      ]);
      
      console.log("Student response:", studentsResponse.data);
      console.log("Teacher response:", teachersResponse.data);
      
      if (studentsResponse.data && studentsResponse.data.success) {
        setTotalStudents(studentsResponse.data.totalStudents);
        console.log("Updated total students to:", studentsResponse.data.totalStudents);
      } else {
        console.error("Invalid student response format:", studentsResponse.data);
      }
      
      if (teachersResponse.data && teachersResponse.data.success) {
        setTotalTeachers(teachersResponse.data.totalTeachers);
        console.log("Updated total teachers to:", teachersResponse.data.totalTeachers);
      } else {
        console.error("Invalid teacher response format:", teachersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    }
  };

  fetchData();
}, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchStudents(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const searchStudents = async (term) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students?search=${term}`);
      if (response.data && response.data.success) {
        setSearchResults(response.data.students);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto p-4">
        {/* Dashboard Header & Registration Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-[#E69D52] hover:bg-[#d68c41] transition-colors shadow-lg text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Registration <FaPlus />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-10 border border-gray-100">
                <Link
                  to="/student/registration"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <PiStudentFill className="mr-3" /> Student Registration
                </Link>
                <Link
                  to="/teacher/registration"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <FaChalkboardTeacher className="mr-3" /> Teacher Registration
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ayah Box with improved styling */}
        <div className="bg-gradient-to-r from-[#e24c01] to-[#f86e2d] text-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">📖</span> Daily Quran Verse
          </h2>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-8 bg-white bg-opacity-20 rounded w-3/4 ml-auto"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-full"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <p>Failed to load verse. Please refresh to try again.</p>
          ) : (
            <>
              <p className="text-2xl text-right font-[Lateef] mb-4 leading-relaxed">{ayah.arabicText}</p>
              <p className="italic mb-3 text-white text-opacity-90">`{ayah.translation}`</p>
              <div className="flex items-center text-sm text-white text-opacity-80">
                <span className="mr-1">📍</span>
                <span>Surah {ayah.surahName} - Ayah {ayah.verseNumber}</span>
              </div>
            </>
          )}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Bar with icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students by name, father's name, address, or phone number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((student) => (
                    <div
                      key={student._id}
                      className="bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{student.fullName}</h3>
                      <p className="text-gray-600">Class: {student.classType}</p>
                      <p className="text-gray-600">Admission #: {student.admissionNumber}</p>
                      <Link 
                        to={`/student/${student._id}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-[#FB9858] to-[#FFC39E] rounded-xl text-white flex items-center justify-between p-6 shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <h5 className="font-bold text-3xl">{totalStudents}</h5>
                  <h1 className="font-light text-xl">Total Students</h1>
                </div>
                <div className="bg-white rounded-full p-3 shadow-md">
                  <PiStudentFill size={40} color="#FB9858" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#7C76DE] to-[#9A96E7] rounded-xl text-white flex items-center justify-between p-6 shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <h5 className="font-bold text-3xl">{totalTeachers}</h5>
                  <h1 className="font-light text-xl">Total Teachers</h1>
                </div>
                <div className="bg-white rounded-full p-3 shadow-md">
                  <FaChalkboardTeacher size={40} color="#7C76DE" />
                </div>
              </div>
            </div>

            {/* Performance Graph */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Students Performance</h2>
              <HifzClassesPerformanceGraph classType="Hifz" />
            </div>
          </div>

          {/* Right Side - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md ">
              <PoorPerformersList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;