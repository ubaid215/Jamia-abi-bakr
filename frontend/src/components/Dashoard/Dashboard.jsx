import { FaArrowDown, FaChalkboardTeacher, FaPlus } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { useState, useEffect } from "react";
import Header from "../layout/Header";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0); // State for total students
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [searchResults, setSearchResults] = useState([]); // State for search results

  // Fetch random Ayah on component mount
  useEffect(() => {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1; // Random Ayah between 1 and 6236
    fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,ur.junagarhi`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const arabicText = data.data[0].text; // Arabic Ayah
          const translation = data.data[1].text; // English Translation
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

  // Fetch total number of students on component mount
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students/count");
        if (response.data && response.data.success) {
          setTotalStudents(response.data.totalStudents);
        }
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    fetchTotalStudents();
  }, []);

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      try {
        const response = await axios.get(`http://localhost:5000/api/students?search=${term}`);
        if (response.data && response.data.success) {
          setSearchResults(response.data.students);
        }
      } catch (error) {
        console.error("Error searching students:", error);
      }
    } else {
      setSearchResults([]); // Clear search results if search term is empty
    }
  };

  return (
    <div className="w-full h-auto">
      <Header />

      {/* Dashboard Title & Button */}
      <div className="px-10 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <Link to="/student/registration">
          <button className="bg-[#E69D52] shadow-xl text-white flex items-center gap-2 p-2 rounded-md cursor-pointer">
            Register New Student <FaPlus />
          </button>
        </Link>
      </div>

      {/* Welcome Box with Quran Ayah */}
      <div className="px-10 py-3 my-6 bg-[#e24c01] text-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">📖 Random Ayah</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <p className="text-2xl text-right font-[Lateef] mb-4">{ayah.arabicText}</p>
            <p className="italic mb-2">`{ayah.translation}`</p>
            <p className="text-sm">📍 {ayah.surahName} - Ayah {ayah.verseNumber}</p>
          </>
        )}
      </div>

      {/* Main content for displaying overall system */}
      <div className="px-10 py-5 w-full h-screen flex gap-[1em]">
        <div id="left" className="flex-2 rounded-md p-4">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search students by name, father's name, address, or phone number"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((student) => (
                  <div
                    key={student._id}
                    className="bg-white shadow-md p-4 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold">{student.fullName}</h3>
                    <p>Class: {student.classType}</p>
                    <p>Admission Number: {student.admissionNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Students and Teachers Cards */}
          <div className="flex gap-10">
            <div className="w-full h-[32] bg-gradient-to-r from-[#FB9858] to-[#FFC39E] rounded-3xl text-zinc-50 flex items-center justify-between gap-2 p-6 shadow-xl">
              <div>
                <h5 className="font-bold text-3xl">{totalStudents}</h5>
                <h1 className="font-light text-xl">Total Students</h1>
              </div>
              <div>
                <PiStudentFill size={50} color="#FB9858" className="bg-white rounded-full p-2" />
              </div>
            </div>
            <div className="w-full h-[32] bg-gradient-to-r to-[#9A96E7] from-[#7C76DE] rounded-3xl text-zinc-50 flex items-center justify-between gap-2 p-6 shadow-xl">
              <div>
                <h5 className="font-bold text-3xl">5</h5>
                <h1 className="font-light text-xl">Total Teachers</h1>
              </div>
              <div>
                <FaChalkboardTeacher size={50} color="#9A96E7" className="bg-white rounded-full p-2" />
              </div>
            </div>
          </div>
        </div>

        <div id="right" className="flex-1 rounded-md p-4">
          <div id="performance" className="w-full h-full bg-gray-100 rounded-2xl p-5 shadow-2xl">
            <div id="performance-top" className="flex items-center justify-between mb-5">
              <h1 className="text-black font-extrabold text-2xl">Top Students</h1>
              <div className="flex gap-1.5 bg-white text-zinc-600 p-2 items-center justify-center rounded-3xl">
                <h5>Class</h5>
                <FaArrowDown size={15} />
              </div>
            </div>
            <div id="performance-bottom" className="flex flex-col gap-3">
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
              <div className="w-full h-auto bg-gray-200 flex items-center p-2 rounded-xl">
                <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full mr-7" />
                <div>
                  <h1 className="font-semibold text-xl opacity-80">Student Name</h1>
                  <p className="text-[12px] font-bold">Performance 90%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;