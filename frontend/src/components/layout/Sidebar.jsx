import { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaChevronUp, FaChalkboardTeacher } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const sidebarColors = {
  bg: "#242A7C", // Dark Blue Background
  hover: "#E69D52", // Orange Hover Effect
  text: "#FFD3A5", // Light Text
};

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isStudentOpen, setIsStudentOpen] = useState(false);
  const location = useLocation();

  const toggleStudentDropdown = () => setIsStudentOpen(!isStudentOpen);

  return (
    <div
      className={`h-screen ${isOpen ? "w-52 px-3" : "w-16"} transition-all duration-300  fixed left-0 top-0 z-50`}
      style={{ backgroundColor: sidebarColors.bg, color: sidebarColors.text }}
    >
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
        <button onClick={toggleSidebar} className="focus:outline-none">
          <FaBars className="text-2xl" />
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          <li className="mb-2">
            <Link
              to="/"
              className={`flex items-center p-3 rounded-lg ${location.pathname === "/" ? "font-bold" : ""}`}
              style={{ backgroundColor: location.pathname === "/" ? sidebarColors.hover : "transparent" }}
            >
              <FaHome className="text-xl" />
              {isOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>

          <li className="mb-2">
            <div
              onClick={toggleStudentDropdown}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80"
            >
              <div className="flex items-center">
                <FaUser className="text-xl" />
                {isOpen && <span className="ml-3">Students</span>}
              </div>
              {isOpen && (isStudentOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </div>

            {isStudentOpen && isOpen && (
              <ul className="ml-8 mt-2">
                <li className="mb-2">
                  <Link
                    to="/student/studentlist"
                    className={`flex items-center p-2 rounded-lg ${location.pathname === "/student/studentlist" ? "font-bold" : ""}`}
                    style={{
                      backgroundColor:
                        location.pathname === "/student/studentlist" ? sidebarColors.hover : "transparent",
                    }}
                  >
                    <span>Student List</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-2">
            <Link
              to="/teachers/allteahcers"
              className={`flex items-center p-3 rounded-lg ${location.pathname === "/teachers/allteahcers" ? "font-bold" : ""}`}
              style={{ backgroundColor: location.pathname === "/teachers/allteahcers" ? sidebarColors.hover : "transparent" }}
            >
              <FaChalkboardTeacher className="text-xl" />
              {isOpen && <span className="ml-3">Teachers</span>}
            </Link>
          </li>

          <li className="mb-2">
            <Link
              to="/settings"
              className={`flex items-center p-3 rounded-lg ${location.pathname === "/settings" ? "font-bold" : ""}`}
              style={{ backgroundColor: location.pathname === "/settings" ? sidebarColors.hover : "transparent" }}
            >
              <FaCog className="text-xl" />
              {isOpen && <span className="ml-3">Settings</span>}
            </Link>
          </li>

          <li className="mb-2">
            <Link
              to="/logout"
              className="flex items-center p-3 rounded-lg hover:opacity-80"
            >
              <FaSignOutAlt className="text-xl" />
              {isOpen && <span className="ml-3">Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${isOpen ? "ml-38" : "ml-2"} p-6`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
