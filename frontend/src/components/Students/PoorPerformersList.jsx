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
          "http://localhost:5000/api/students/poor-performers"
        );
        if (response.data && response.data.success) {
          setStudents(response.data.students);
        } else {
          setError("Failed to fetch students");
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoorPerformers();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading students...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Students with Poor Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          students.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))
        )}
      </div>
    </div>
  );
};

export default PoorPerformersList;