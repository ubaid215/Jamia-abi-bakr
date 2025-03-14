import PropTypes from "prop-types";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ students }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white  overflow-hidden">
      <div className="space-y-4">
        {students.map((student) => (
          <div
            key={student._id}
            className="flex items-center justify-between p-4 hover:bg-gray-200  rounded-lg transition-colors duration-300"
          >
            <div className="flex items-center space-x-4">
              <img
                src={
                  student.profileImage
                    ? `http://localhost:5000${student.profileImage}`
                    : "/default-profile.png"
                }
                alt={student.fullName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <div>
                <h3 className="lg:text-md text-sm font-semibold text-gray-800">
                  {student.fullName}
                </h3>
                <p className="text-sm text-gray-600">{student.classType}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/students/${student._id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-300"
              aria-label={`View details of ${student.fullName}`}
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

StudentCard.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      profileImage: PropTypes.string,
      fullName: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default memo(StudentCard);