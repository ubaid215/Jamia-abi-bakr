import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaBell } from "react-icons/fa"; // Import bell icon from react-icons

const socket = io("http://localhost:5000", {
  withCredentials: true, // If your backend requires credentials
});

const Notification = () => {
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [isOpen, setIsOpen] = useState(false); // Toggle notification dropdown
  const dropdownRef = useRef(null); // Ref for the dropdown

  // Listen for new notifications
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("alert", (data) => {
      setNotifications((prev) => [{ ...data, timestamp: new Date() }, ...prev]);
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("alert");
      socket.disconnect();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle notification dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none relative"
      >
        <FaBell className="text-xl text-gray-700" />
        {/* Notification Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 font-semibold text-gray-700 flex justify-between items-center">
            Notifications
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index} // Use a unique key (replace with notification.id if available)
                  className="p-4 border-b border-gray-200 hover:bg-gray-50"
                >
                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;