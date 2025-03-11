import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload, FaSave, FaEdit, FaExchangeAlt } from "react-icons/fa"; // Added FaExchangeAlt for migrate icon
import Header from "../components/layout/Header";
import DailyReport from "../components/DailyReport";
import Analytics from "../components/Analytics";

const StudentDetails = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("fullDetail"); // State for active tab
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editedStudent, setEditedStudent] = useState({}); // State for edited student data
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false); // State for migrate modal
  const [newClassType, setNewClassType] = useState(""); // State for new class type
  const [availableClassTypes, setAvailableClassTypes] = useState([]); // State for available class types
  const navigate = useNavigate();

  // Fetch student details from the backend
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );
      if (response.data && response.data.success) {
        setStudent(response.data.student); // Update state with fetched student
        setEditedStudent(response.data.student); // Initialize editedStudent with fetched data
      } else {
        setError("Student not found");
      }
    } catch (error) {
      setError("Error fetching student details: " + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch available class types from the backend
  const fetchAvailableClassTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teachers/class-types");
      if (response.data && response.data.success) {
        setAvailableClassTypes(response.data.classTypes);
      }
    } catch (error) {
      console.error("Error fetching class types:", error);
    }
  };

  // Handle student migration
  const handleMigrateStudent = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/students/migrate`,
        {
          studentId: id,
          newClassType,
        }
      );
      if (response.data.success) {
        fetchStudentDetails(); // Refresh student details
        setIsMigrateModalOpen(false); // Close the modal
        alert("Student migrated successfully!");
      }
    } catch (error) {
      console.error("Error migrating student:", error);
      alert("Failed to migrate student.");
    }
  };

  // Open migrate modal and fetch class types
  const openMigrateModal = () => {
    fetchAvailableClassTypes();
    setIsMigrateModalOpen(true);
  };

  // Handle student image upload
  const handleStudentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/students/${id}/upload-student-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          fetchStudentDetails(); // Refresh student details after upload
        }
      } catch (error) {
        console.error("Error uploading student image:", error);
      }
    }
  };

  // Handle father image upload
  const handleFatherImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/students/${id}/upload-father-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          fetchStudentDetails(); // Refresh student details after upload
        }
      } catch (error) {
        console.error("Error uploading father image:", error);
      }
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle guardian input changes in edit mode
  const handleGuardianInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      guardian: {
        ...prev.guardian,
        [name]: value,
      },
    }));
  };

  // Save updated student details
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/students/${id}`,
        editedStudent
      );
      if (response.data.success) {
        setStudent(response.data.student); // Update the student data
        setIsEditing(false); // Exit edit mode
        alert("Student details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating student details:", error);
      alert("Failed to update student details.");
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
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mb-4 cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          Back to Student List
        </button>
        <div className="flex gap-6">
          {/* Left Section */}
          <div className="w-1/3">
            <div className="bg-[#FAF9F6] shadow-md rounded-lg p-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={
                      student.profileImage
                        ? `http://localhost:5000${student.profileImage}`
                        : "https://picsum.photos/150"
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <label
                    htmlFor="upload-student-image"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                  >
                    <FaUpload />
                  </label>
                  <input
                    type="file"
                    id="upload-student-image"
                    className="hidden"
                    onChange={handleStudentImageUpload}
                  />
                </div>
                <h2 className="text-xl font-semibold">{student.fullName}</h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? (
                    <select
                      name="status"
                      value={editedStudent.status}
                      onChange={handleInputChange}
                      className="p-1 border border-gray-300 rounded"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  ) : (
                    student.status
                  )}
                </p>
              </div>
              <div className="mt-4">
                <p>
                  <strong>Roll Number:</strong> {student.rollNumber}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </p>
                <p>
                  <strong>Date of Admission:</strong>{" "}
                  {new Date(student.dateOfAdmission).toLocaleDateString()}
                </p>
                <p>
                  <strong>Class Name:</strong> {student.classType}
                </p>
                <p>
                  <strong>Teacher Name:</strong> {student.teacherName}
                </p>
              </div>
              {/* Migrate Button */}
              <button
                onClick={openMigrateModal}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-purple-600 hover:text-white transition-all"
              >
                <FaExchangeAlt className="mr-2" /> Migrate Student
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-2/3">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("fullDetail")}
                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${
                  activeTab === "fullDetail"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Full Detail
              </button>
              <button
                onClick={() => setActiveTab("dailyReport")}
                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${
                  activeTab === "dailyReport"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Daily Report
              </button>
              <button
                onClick={() => setActiveTab("examsAndResult")}
                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${
                  activeTab === "examsAndResult"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Exams and Result
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 cursor-pointer py-2 rounded-lg transition-colors ${
                  activeTab === "analytics"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-[#FAF9F6] shadow-md rounded-lg p-6">
              {activeTab === "fullDetail" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Full Details</h3>
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                      >
                        <FaSave className="mr-2" /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="relative w-20 h-20">
                      <img
                        src={
                          student.fatherImage
                            ? `http://localhost:5000${student.fatherImage}`
                            : "https://via.placeholder.com/100"
                        }
                        alt="Father"
                        className="w-full h-full rounded-full object-cover"
                      />
                      <label
                        htmlFor="upload-father-image"
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                      >
                        <FaUpload className="text-sm" />
                      </label>
                      <input
                        type="file"
                        id="upload-father-image"
                        className="hidden"
                        onChange={handleFatherImageUpload}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>Father Name:</strong>{" "}
                        {isEditing ? (
                          <input
                            type="text"
                            name="fatherName"
                            value={editedStudent.fatherName}
                            onChange={handleInputChange}
                            className="p-1 border border-gray-300 rounded"
                          />
                        ) : (
                          student.fatherName
                        )}
                      </p>
                      <p>
                        <strong>Phone Number:</strong>{" "}
                        {isEditing ? (
                          <input
                            type="text"
                            name="phoneNumber"
                            value={editedStudent.phoneNumber}
                            onChange={handleInputChange}
                            className="p-1 border border-gray-300 rounded"
                          />
                        ) : (
                          student.phoneNumber
                        )}
                      </p>
                    </div>
                  </div>
                  <p>
                    <strong>Education Details:</strong>{" "}
                    {isEditing ? (
                      <textarea
                        name="educationDetail"
                        value={editedStudent.educationDetail}
                        onChange={handleInputChange}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.educationDetail
                    )}
                  </p>
                  <p>
                    <strong>Permanent Address:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="permanentAddress"
                        value={editedStudent.permanentAddress}
                        onChange={handleInputChange}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.permanentAddress
                    )}
                  </p>
                  <p>
                    <strong>Current Address:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="currentAddress"
                        value={editedStudent.currentAddress}
                        onChange={handleInputChange}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.currentAddress
                    )}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editedStudent.phoneNumber}
                        onChange={handleInputChange}
                        className="p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.phoneNumber
                    )}
                  </p>
                  <h4 className="text-lg font-semibold mt-4">
                    Guardian Details
                  </h4>
                  <p>
                    <strong>Name:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedStudent.guardian.name}
                        onChange={handleGuardianInputChange}
                        className="p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.guardian.name
                    )}
                  </p>
                  <p>
                    <strong>Relation:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="relation"
                        value={editedStudent.guardian.relation}
                        onChange={handleGuardianInputChange}
                        className="p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.guardian.relation
                    )}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editedStudent.guardian.phoneNumber}
                        onChange={handleGuardianInputChange}
                        className="p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.guardian.phoneNumber
                    )}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editedStudent.guardian.address}
                        onChange={handleGuardianInputChange}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.guardian.address
                    )}
                  </p>
                  <p>
                    <strong>Office Address:</strong>{" "}
                    {isEditing ? (
                      <input
                        type="text"
                        name="officeAddress"
                        value={editedStudent.guardian.officeAddress}
                        onChange={handleGuardianInputChange}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      student.guardian.officeAddress
                    )}
                  </p>
                </div>
              )}
              {activeTab === "dailyReport" && <DailyReport studentId={id} />}
              {activeTab === "examsAndResult" && (
                <div>Exams and Result Content</div>
              )}
              {activeTab === "analytics" && <Analytics studentId={id}/>}
            </div>
          </div>
        </div>

        {/* Migrate Modal */}
        {isMigrateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Migrate Student</h3>
              <select
                value={newClassType}
                onChange={(e) => setNewClassType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select New Class Type</option>
                {availableClassTypes.map((classType) => (
                  <option key={classType} value={classType}>
                    {classType}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsMigrateModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMigrateStudent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Migrate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDetails;