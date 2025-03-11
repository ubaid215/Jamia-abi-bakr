import  { useEffect, useState } from "react";
import axios from "axios";
import StudentCard from "./StudentCard";

const PoorPerformersList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students with poor performance
  useEffect(() => {
    const fetchPoorPerformers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/performance/poor-performers"
        );

        // Check if the response is valid
        if (response.data && response.data.success) {
          setStudents(response.data.students);
        } else {
          setError("Failed to fetch students: Invalid response from server");
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoorPerformers();
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

  // Display students in a grid layout
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Students with Poor Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentCard key={student._id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default PoorPerformersList;