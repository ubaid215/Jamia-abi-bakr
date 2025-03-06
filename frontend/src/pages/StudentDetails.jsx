import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";

const StudentDetails = () => {
    const { id } = useParams(); // Get student ID from the URL
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch student details from the backend
    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/students/${id}`);
            if (response.data && response.data.success) {
                setStudent(response.data.student); // Update state with fetched student
            } else {
                setError("Student not found");
            }
        } catch (error) {
            setError("Error fetching student details: " + error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch student details when the component mounts
    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    // Display loading or error messages
    if (loading) {
        return <p className="text-center mt-8">Loading student details...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                <button
                    onClick={() => navigate(-1)} // Go back to the previous page
                    className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                    Back to Student List
                </button>
                <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
                <div className="space-y-4">
                    <p><strong>Full Name:</strong> {student.fullName}</p>
                    <p><strong>Father Name:</strong> {student.fatherName}</p>
                    <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Admission Number:</strong> {student.admissionNumber}</p>
                    <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                    <p><strong>Class Type:</strong> {student.classType}</p>
                    <p><strong>Education Details:</strong> {student.educationDetail}</p>
                    <p><strong>Permanent Address:</strong> {student.permanentAddress}</p>
                    <p><strong>Current Address:</strong> {student.currentAddress}</p>
                    <p><strong>Phone Number:</strong> {student.phoneNumber}</p>
                    <h3 className="text-xl font-semibold mt-4">Guardian Details</h3>
                    <p><strong>Name:</strong> {student.guardian.name}</p>
                    <p><strong>Relation:</strong> {student.guardian.relation}</p>
                    <p><strong>Phone Number:</strong> {student.guardian.phoneNumber}</p>
                    <p><strong>Address:</strong> {student.guardian.address}</p>
                    <p><strong>Office Address:</strong> {student.guardian.officeAddress}</p>
                </div>
            </div>
        </>
    );
};

export default StudentDetails;