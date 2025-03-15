import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaIdCard, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const TeacherDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize state with data from location state if available
  const [teacher, setTeacher] = useState(location.state?.teacher || null);
  const [loading, setLoading] = useState(!location.state?.teacher);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    cnic: '',
    phoneNumber: '',
    address: '',
    classType: ''
  });
  
  // Fetch teacher data if not available in location state
  useEffect(() => {
    if (!teacher && id) {
      const fetchTeacher = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/teachers/${id}`);
          setTeacher(response.data);
          setFormData(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching teacher:", error);
          setError("Failed to load teacher details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchTeacher();
    } else if (teacher) {
      // Initialize form data with teacher data
      setFormData(teacher);
    }
  }, [id, teacher]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data to original teacher data when canceling edit
      setFormData(teacher);
    }
    setIsEditing(!isEditing);
    setUpdateSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/teachers/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeacher(response.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating teacher:", error);
      setError("Failed to update teacher details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading teacher details...</p>;
  }

  if (error || !teacher) {
    return <p className="text-center text-red-600">{error || "No teacher data found."}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Teacher Details</h2>
        
        {/* Navigation and Action Buttons */}
        <div className="flex justify-between mb-5">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="bg-white cursor-pointer text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
          >
            <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000" />
                <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000" />
              </svg>
            </div>
            <p className="translate-x-2">Go Back</p>
          </button>

          {/* Edit/Cancel Button */}
          <button
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-md text-white flex items-center ${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isEditing ? (
              <>
                <FaTimes className="mr-2" /> Cancel Edit
              </>
            ) : (
              <>
                <FaEdit className="mr-2" /> Edit Details
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Teacher details updated successfully!
          </div>
        )}
        
        {/* Teacher Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                  <input
                    type="text"
                    name="classType"
                    value={formData.classType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* View Details */
            <>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{teacher.fullName}</h3>
                <p className="text-sm text-gray-600">{teacher.fatherName}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaIdCard className="text-blue-600 mr-2" />
                  <p className="text-sm">
                    <strong>CNIC:</strong> {teacher.cnic}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaPhone className="text-blue-600 mr-2" />
                  <p className="text-sm">
                    <strong>Phone:</strong> {teacher.phoneNumber}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  <p className="text-sm">
                    <strong>Address:</strong> {teacher.address}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <FaGraduationCap className="text-blue-600 mr-2" />
                  <p className="text-sm">
                    <strong>Class Type:</strong> {teacher.classType}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;