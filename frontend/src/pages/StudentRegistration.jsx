import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import Header from "../components/layout/Header";

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    dateOfAdmission: "",
    idCardNumber: "",
    permanentAddress: "",
    currentAddress: "",
    classType: "",
    educationDetail: "",
    teacherName: "",
    guardian: {
      name: "",
      relation: "",
      phoneNumber: "",
      address: "",
      officeAddress: "",
    },
    fatherPhoneNumber: "",
    status: "Active", // Add status field
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({}); // State to track validation errors
  const navigate = useNavigate(); // For redirection

  // Validate the current step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.fatherName) newErrors.fatherName = "Father's Name is required";
      if (!formData.fatherPhoneNumber) newErrors.fatherPhoneNumber = "Father's Phone Number is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
      if (!formData.dateOfAdmission) newErrors.dateOfAdmission = "Date of Admission is required";
    }

    if (step === 2) {
      if (!formData.idCardNumber) newErrors.idCardNumber = "ID Card Number is required";
      if (!formData.classType) newErrors.classType = "Class Type is required";
      if (!formData.teacherName) newErrors.teacherName = "Teacher Name is required";
      if (!formData.educationDetail) newErrors.educationDetail = "Education Details are required";
      if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent Address is required";
      if (!formData.currentAddress) newErrors.currentAddress = "Current Address is required";
    }

    if (step === 3) {
      if (!formData.guardian.name) newErrors.guardianName = "Guardian Name is required";
      if (!formData.guardian.relation) newErrors.guardianRelation = "Relation is required";
      if (!formData.guardian.phoneNumber) newErrors.guardianPhoneNumber = "Guardian's Phone Number is required";
      if (!formData.guardian.address) newErrors.guardianAddress = "Guardian Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the updated field
  };

  // Handle guardian input changes
  const handleGuardianChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      guardian: {
        ...prevData.guardian,
        [name]: value,
      },
    }));
    setErrors({ ...errors, [name]: "" }); // Clear the error for the updated field
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/students/register",
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        alert("Student registered successfully!");
        console.log(response.data);
        navigate("/student/studentlist"); // Redirect to Student List page
      } catch (error) {
        console.error("Error registering student:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
        {/* Progress Bar */}
        <div className="flex items-center mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`w-1/4 flex justify-center`}>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all 
                          ${step >= num ? "bg-blue-600" : "bg-gray-300"}`}
              >
                {num}
              </div>
              {num < 4 && (
                <div
                  className={`flex-1 h-1 ${
                    step > num ? "bg-blue-600" : "bg-gray-300"
                  } mx-2`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Student Registration
        </h2>

        {/* Step 1 - Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father Name</label>
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                value={formData.fatherName}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.fatherName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.fatherName && (
                <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father Phone Number</label>
              <input
                type="text"
                name="fatherPhoneNumber"
                placeholder="Father's Phone Number"
                value={formData.fatherPhoneNumber}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.fatherPhoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.fatherPhoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.fatherPhoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.dateOfAdmission ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.dateOfAdmission && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfAdmission}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2 - Academic Details */}
        {step === 2 && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Card Number</label>
              <input
                type="text"
                name="idCardNumber"
                placeholder="ID Card Number"
                value={formData.idCardNumber}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.idCardNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.idCardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.idCardNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Type</label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.classType ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Hifz-A">Hifz-A</option>
                <option value="Hifz-B">Hifz-B</option>
                <option value="Nazra">Nazra</option>
                <option value="Dars-e-Nizami">Dars-e-Nizami</option>
                <option value="Academic">Academic</option>
              </select>
              {errors.classType && (
                <p className="text-red-500 text-sm mt-1">{errors.classType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
              <input
                type="text"
                name="teacherName"
                placeholder="Teacher's Name"
                value={formData.teacherName}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.teacherName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.teacherName && (
                <p className="text-red-500 text-sm mt-1">{errors.teacherName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Education Details</label>
              <textarea
                name="educationDetail"
                placeholder="Education Details"
                value={formData.educationDetail}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.educationDetail ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.educationDetail && (
                <p className="text-red-500 text-sm mt-1">{errors.educationDetail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <input
                type="text"
                name="permanentAddress"
                placeholder="Permanent Address"
                value={formData.permanentAddress}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.permanentAddress ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.permanentAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.permanentAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Address</label>
              <input
                type="text"
                name="currentAddress"
                placeholder="Current Address"
                value={formData.currentAddress}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.currentAddress ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.currentAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.currentAddress}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Guardian Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
              <input
                type="text"
                name="name"
                placeholder="Guardian Name"
                value={formData.guardian.name}
                onChange={handleGuardianChange}
                className={`w-full p-3 border ${
                  errors.guardianName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.guardianName && (
                <p className="text-red-500 text-sm mt-1">{errors.guardianName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relation</label>
              <input
                type="text"
                name="relation"
                placeholder="Relation"
                value={formData.guardian.relation}
                onChange={handleGuardianChange}
                className={`w-full p-3 border ${
                  errors.guardianRelation ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.guardianRelation && (
                <p className="text-red-500 text-sm mt-1">{errors.guardianRelation}</p>
              )}
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Guardian's Phone Number"
                value={formData.guardian.phoneNumber}
                onChange={handleGuardianChange}
                className={`w-full p-3 border ${
                  errors.guardianPhoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.guardianPhoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.guardianPhoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Address</label>
              <input
                type="text"
                name="address"
                placeholder="Guardian Address"
                value={formData.guardian.address}
                onChange={handleGuardianChange}
                className={`w-full p-3 border ${
                  errors.guardianAddress ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.guardianAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.guardianAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Office Address</label>
              <input
                type="text"
                name="officeAddress"
                placeholder="Guardian Office Address"
                value={formData.guardian.officeAddress}
                onChange={handleGuardianChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Review and Submit */}
        {step === 4 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Review Your Details
            </h3>
            <div className="bg-gray-100 p-4 rounded-md shadow-inner">
              <p>
                <strong>Full Name:</strong> {formData.fullName}
              </p>
              <p>
                <strong>Father Name:</strong> {formData.fatherName}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formData.dateOfBirth}
              </p>
              <p>
                <strong>Date of Admission:</strong> {formData.dateOfAdmission}
              </p>
              <p>
                <strong>Permanent Address:</strong> {formData.permanentAddress}
              </p>
              <p>
                <strong>Current Address:</strong> {formData.currentAddress}
              </p>
              <p>
                <strong>ID Card Number:</strong> {formData.idCardNumber}
              </p>
              <p>
                <strong>Class Type:</strong> {formData.classType}
              </p>
              <p>
                <strong>Teacher Name:</strong> {formData.teacherName}
              </p>
              <p>
                <strong>Education Details:</strong> {formData.educationDetail}
              </p>
              <p>
                <strong>Guardian Name:</strong> {formData.guardian.name}
              </p>
              <p>
                <strong>Relation:</strong> {formData.guardian.relation}
              </p>
              <p>
                <strong>Father Phone Number:</strong> {formData.fatherPhoneNumber}
              </p>
              <p>
                <strong>Guardian Phone Number:</strong> {formData.guardian.phoneNumber}
              </p>
              <p>
                <strong>Guardian Address:</strong> {formData.guardian.address}
              </p>
              <p>
                <strong>Guardian Office Address:</strong> {formData.guardian.officeAddress}
              </p>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentRegistration;