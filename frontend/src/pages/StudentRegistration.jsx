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
    admissionNumber: "",
    rollNumber: "",
    idCardNumber: "",
    permanentAddress: "",
    currentAddress: "",
    phoneNumber: "",
    classType: "Hifz",
    educationDetail: "",
    guardian: {
      name: "",
      relation: "",
      phoneNumber: "",
      address: "",
      officeAddress: "",
    },
    agreedToTerms: false,
  });

  const navigate = useNavigate(); // For redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardianChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      guardian: {
        ...prevData.guardian,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/students/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Student registered successfully!");
      console.log(response.data);
      navigate("/student/studentlist"); // Redirect to Student List page
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Request error:", error.message);
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father Name</label>
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
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
              <label className="block text-sm font-medium text-gray-700">Admission Number</label>
              <input
                type="text"
                name="admissionNumber"
                placeholder="Admission Number"
                value={formData.admissionNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Card Number</label>
              <input
                type="text"
                name="idCardNumber"
                placeholder="ID Card Number"
                value={formData.idCardNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Type</label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Hifz">Hifz</option>
                <option value="Nazra">Nazra</option>
                <option value="Dars-e-Nizami">Dars-e-Nizami</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Education Details</label>
              <textarea
                name="educationDetail"
                placeholder="Education Details"
                value={formData.educationDetail}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relation</label>
              <input
                type="text"
                name="relation"
                placeholder="Relation"
                value={formData.guardian.relation}
                onChange={handleGuardianChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Guardian Phone Number"
                value={formData.guardian.phoneNumber}
                onChange={handleGuardianChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guardian Address</label>
              <input
                type="text"
                name="address"
                placeholder="Guardian Address"
                value={formData.guardian.address}
                onChange={handleGuardianChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Review
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
                <strong>Admission Number:</strong> {formData.admissionNumber}
              </p>
              <p>
                <strong>Roll Number:</strong> {formData.rollNumber}
              </p>
              <p>
                <strong>ID Card Number:</strong> {formData.idCardNumber}
              </p>
              <p>
                <strong>Class Type:</strong> {formData.classType}
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
                onClick={() => setStep(3)}
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