/* eslint-disable react/prop-types */

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Top Section: Profile Image */}
      <div className="p-4 flex flex-col items-center text-center">
        <img
          src={`http://localhost:5000${student.profileImage}`} // Use backend image URL
          alt={student.fullName}
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800">
          {student.fullName}
        </h3>
        <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
      </div>

      {/* Middle Section: Performance Details */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Class: <span className="font-medium">{student.classType}</span>
        </p>
        <p className="text-sm text-gray-600">
          Condition:{" "}
          <span className="font-medium text-red-500">Below Average</span>
        </p>
      </div>

      {/* Lower Section: Action Buttons */}
      <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => console.log("View Details:", student._id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default StudentCard;