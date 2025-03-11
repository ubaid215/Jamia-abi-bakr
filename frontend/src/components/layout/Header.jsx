import { FaSearch,  FaUserCircle } from "react-icons/fa";
import Notification from "../Notification";

const Header = () => {
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
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <FaUserCircle className="text-3xl text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;
