import { FaSearch, FaUserCircle } from "react-icons/fa";
import Notification from "../Notification";
import { useState } from "react"; // Import useState
import Profile from "../../pages/Profile"; 

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control modal visibility

  const toggleProfileModal = () => {
    setIsProfileOpen(!isProfileOpen); // Toggle modal visibility
  };

  return (
    <header className="bg-white shadow-md p-4 mb-3 flex justify-between items-center">
      {/* Search Box */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* Notification & Profile */}
      <div className="flex items-center space-x-6">
        {/* Bell Icon */}
        <Notification />

        {/* Profile Circle */}
        <div
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={toggleProfileModal} // Open modal on click
        >
          <FaUserCircle className="text-3xl text-gray-600" />
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile</h2>
              <button
                onClick={toggleProfileModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times; 
              </button>
            </div>
            <Profile /> 
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;