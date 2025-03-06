import { FaUserCircle } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const StudentCard = ({ rollNo, status, name, studentClass, image }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-72 text-center border relative">
      {/* Roll No & Status */}
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
        Roll No: {rollNo}
      </div>
      <div className={`absolute top-2 right-2 text-xs px-3 py-1 rounded-full ${status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
        {status}
      </div>

      {/* Profile Image */}
      <div className="flex justify-center mt-6">
        {image ? (
          <img src={image} alt={name} className="w-24 h-24 rounded-full border" />
        ) : (
          <FaUserCircle className="w-24 h-24 text-gray-400" />
        )}
      </div>

      {/* Name & Class */}
      <h2 className="text-lg font-semibold mt-3">{name}</h2>
      <p className="text-gray-600 text-sm">Class: {studentClass}</p>

      {/* See Details Button */}
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
        See Details
      </button>
    </div>
  );
};

export default StudentCard;
