/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaSave,
  FaEdit,
  FaExchangeAlt,
  FaIdCard,
} from "react-icons/fa";
import {
  FaInfoCircle,
  FaCalendarDay,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";

import Header from "../components/layout/Header";
import DailyReport from "../components/DailyReport";
import Analytics from "../components/Analytics";
import MigrationHistory from "../components/Students/MigrationHistory";

const StudentDetails = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [student, setStudent] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("fullDetail");
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [newClassType, setNewClassType] = useState("");
  const [availableClassTypes, setAvailableClassTypes] = useState([]);
  const navigate = useNavigate();

  // Fetch student details from the backend
  const fetchStudentDetails = async () => {
    try {
      console.log("Fetching student details...");
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );

      console.log("Student details response:", response.data);

      if (response.data && response.data.success) {
        setStudent(response.data.student); // Update state with fetched student
        setEditedStudent(response.data.student); // Initialize editedStudent with fetched data
      } else {
        setError("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError("Error fetching student details: " + error.message);
    } finally {
      console.log("Setting loading to false");
      setLoading(false); // Ensure loading is set to false
    }
  };

  // Fetch available class types from the backend
  const fetchAvailableClassTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/teachers/class-types"
      );
      console.log("Fetched Class Types:", response.data);
      
      // Handle different response formats
      if (response.data && response.data.success && Array.isArray(response.data.classTypes)) {
        setAvailableClassTypes(response.data.classTypes);
      } else if (Array.isArray(response.data)) {
        // If the response itself is an array
        setAvailableClassTypes(response.data);
      } else if (response.data && Array.isArray(response.data.usedClassTypes)) {
        // Based on your terminal output, this might be the case
        setAvailableClassTypes(response.data.usedClassTypes);
      } else if (response.data && Array.isArray(response.data.schemaClassTypes)) {
        // Or this might be the case
        setAvailableClassTypes(response.data.schemaClassTypes);
      } else {
        console.error("Unexpected response format:", response.data);
        setAvailableClassTypes([]);
      }
    } catch (error) {
      console.error("Error fetching class types:", error);
    }
  };

  // Fetch student details and class types when the component mounts
  useEffect(() => {
    fetchStudentDetails(); // Fetch student details
    fetchAvailableClassTypes(); // Fetch class types
  }, [id]); // Re-run when `id` changes

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
    console.log("Modal should be open now, isMigrateModalOpen:", true);
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

  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("documents", file); // Use 'documents' as the field name

      try {
        const response = await axios.post(
          `http://localhost:5000/api/students/${id}/upload-documents`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          alert("Document uploaded successfully!");
          fetchStudentDetails(); // Refresh student details
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        alert("Failed to upload document.");
      }
    }
  };

  const handleDeleteDocument = async (documentPath) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/students/${id}/delete-document`,
        { data: { documentPath } }
      );

      if (response.data.success) {
        alert("Document deleted successfully!");
        fetchStudentDetails(); // Refresh student details
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
    }
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

  // Display loading or error messages
  if (loading) {
    return <p className="text-center mt-8">Loading student details...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  if (!student) {
    return <p className="text-center mt-8">No student data found.</p>;
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
            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTab("fullDetail")}
                className={`px-6 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "fullDetail"
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FaInfoCircle /> Full Detail
              </button>
              {/* Conditionally render Daily Report tab for Hifz students */}
              {["Hifz-A", "Hifz-B"].includes(student?.classType) && (
                <button
                  onClick={() => setActiveTab("dailyReport")}
                  className={`px-6 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === "dailyReport"
                      ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                      : "bg-transparent text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FaCalendarDay /> Daily Report
                </button>
              )}
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "history"
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FaClipboardList /> History
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "analytics"
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FaChartLine /> Analytics
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
                  {/* Father Information Box */}
                  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Father Information
                    </h4>
                    <div className="flex items-center justify-between gap-4">
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
                      <div className="flex-1">
                        <p>
                          <strong>Father Name:</strong>{" "}
                          {isEditing ? (
                            <input
                              type="text"
                              name="fatherName"
                              value={editedStudent.fatherName}
                              onChange={handleInputChange}
                              className="w-full p-1 border border-gray-300 rounded"
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
                              name="fatherPhoneNumber"
                              value={editedStudent.fatherPhoneNumber}
                              onChange={handleInputChange}
                              className="w-full p-1 border border-gray-300 rounded"
                            />
                          ) : (
                            student.fatherPhoneNumber
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Address Box */}
                  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Address</h4>
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
                    <p className="mt-2">
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
                  </div>
                  {/* Guardian Details Box */}
                  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">
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
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        student.guardian.name
                      )}
                    </p>
                    <p className="mt-2">
                      <strong>Relation:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="relation"
                          value={editedStudent.guardian.relation}
                          onChange={handleGuardianInputChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        student.guardian.relation
                      )}
                    </p>
                    <p className="mt-2">
                      <strong>Phone Number:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={editedStudent.guardian.phoneNumber}
                          onChange={handleGuardianInputChange}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        student.guardian.phoneNumber
                      )}
                    </p>
                    <p className="mt-2">
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
                  {/* Document Uploading Box */}
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Documents</h4>
                    <div className="space-y-4">
                      {/* Student's B-Form */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Student B-Form
                        </label>
                        <div className="flex items-center gap-2">
                          <FaUpload className="text-gray-500" />
                          <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleFileUpload(e, "bForm")}
                          />
                        </div>
                      </div>

                      {/* Father's CNIC Front */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Father CNIC (Front)
                        </label>
                        <div className="flex items-center gap-2">
                          <FaIdCard className="text-gray-500" />
                          <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleFileUpload(e, "cnicFront")}
                          />
                        </div>
                      </div>

                      {/* Father's CNIC Back */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Father CNIC (Back)
                        </label>
                        <div className="flex items-center gap-2">
                          <FaIdCard className="text-gray-500" />
                          <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => handleFileUpload(e, "cnicBack")}
                          />
                        </div>
                      </div>

                      {/* Display Uploaded Documents */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Uploaded Documents
                        </h4>
                        {student.documents && student.documents.length > 0 ? (
                          <div className="space-y-2">
                            {student.documents.map((document, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 border border-gray-200 rounded"
                              >
                                <a
                                  href={`http://localhost:5000${document}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  Document {index + 1}
                                </a>
                                <button
                                  onClick={() => handleDeleteDocument(document)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No documents uploaded yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "dailyReport" && <DailyReport studentId={id} />}
              {activeTab === "history" && <MigrationHistory studentId={id} />}
              {activeTab === "analytics" && <Analytics studentId={id} />}
            </div>
          </div>
        </div>

        {/* Migrate Modal */}
        {isMigrateModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsMigrateModalOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Migrate Student</h3>

              {availableClassTypes.length > 0 ? (
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
              ) : (
                <p className="text-red-500 mb-4">
                  No class types available. Please check your connection to the
                  server.
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMigrateModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMigrateStudent}
                  disabled={!newClassType || availableClassTypes.length === 0}
                  className={`px-4 py-2 ${
                    !newClassType || availableClassTypes.length === 0
                      ? "bg-blue-300"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg`}
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
