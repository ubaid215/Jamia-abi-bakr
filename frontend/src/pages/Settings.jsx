import React, { useState, useEffect } from "react";

const Settings = () => {
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, name: "John Doe", role: "teacher" },
    { id: 2, name: "Jane Smith", role: "admin" },
  ]);

  const [pageAccess, setPageAccess] = useState({
    dashboard: true,
    studentList: true,
    teacherList: false,
    settings: true,
  });

  // Handle granting permission
  const handleGrantPermission = (userId) => {
    setPendingApprovals((prev) => prev.filter((user) => user.id !== userId));
    alert(`Permission granted for user ${userId}`);
  };

  // Handle toggling page access
  const handleToggleAccess = (page) => {
    setPageAccess((prev) => ({
      ...prev,
      [page]: !prev[page],
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
          {pendingApprovals.length > 0 ? (
            pendingApprovals.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <button
                  onClick={() => handleGrantPermission(user.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Grant Permission
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pending approvals</p>
          )}
        </div>

        {/* Page Access Control Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Page Access Control</h2>
          {Object.entries(pageAccess).map(([page, isEnabled]) => (
            <div key={page} className="flex justify-between items-center mb-4">
              <p className="font-medium capitalize">{page}</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => handleToggleAccess(page)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;