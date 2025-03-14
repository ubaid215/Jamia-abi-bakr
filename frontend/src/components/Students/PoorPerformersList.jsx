import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import StudentCard from "./StudentCard";

// Connect to the Socket.IO server
const socket = io("http://localhost:5000");

const PoorPerformersList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial list of poor performers
  useEffect(() => {
    const fetchPoorPerformers = async () => {
      try {
        console.log("Fetching poor performers from API...");
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/students/performance/poor-performers"
        );

        console.log("API Response:", response.data);

        if (response.data && response.data.success) {
          setStudents(response.data.students);
        } else {
          setError("Failed to fetch students: " + (response.data?.message || "Invalid response from server"));
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Error fetching students: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPoorPerformers();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    // Handle new poor performer alerts
    socket.on("poorPerformerAlert", (newStudent) => {
      setStudents((prevStudents) => [newStudent, ...prevStudents]); // Add new student to the top
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("poorPerformerAlert");
    };
  }, []);

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading students...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  // Display empty state
  if (students.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">No students with poor performance found.</p>
      </div>
    );
  }

  // Render the list of students
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Students with Poor Performance</h2>
      <StudentCard students={students} />
    </div>
  );
};

export default PoorPerformersList;