import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StudentContext = createContext();

// eslint-disable-next-line react/prop-types
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data); // Update state with latest students
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Add a new student and update state
  const addStudent = async (studentData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/students/register", studentData);
      setStudents((prevStudents) => [...prevStudents, response.data]); // Update student list instantly
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <StudentContext.Provider value={{ students, fetchStudents, addStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
