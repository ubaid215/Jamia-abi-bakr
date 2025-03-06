import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar"; // Import the SearchBar component

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [studentsPerPage, setStudentsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const navigate = useNavigate();

    // Fetch students from the backend
    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/students?page=${currentPage}&limit=${studentsPerPage}&search=${searchTerm}`
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

    // Fetch students when the component mounts or when pagination/search term changes
    useEffect(() => {
        fetchStudents();
    }, [currentPage, studentsPerPage, searchTerm]);

    // Handle search
    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to the first page when searching
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

                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />

                {/* Display Students */}
                {students.length === 0 ? (
                    <p className="text-gray-500">No students found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.map((student) => (
                            <div
                                key={student._id}
                                className="bg-white shadow-md p-4 rounded-lg"
                            >
                                <h3 className="text-lg font-semibold">{student.fullName}</h3>
                                <p>Class: {student.classType}</p>
                                <p>Admission Number: {student.admissionNumber}</p>
                                <button
                                    onClick={() => navigate(`/students/${student._id}`)}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    See Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="mx-4 self-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default StudentList;