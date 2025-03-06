import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from localStorage or sessionStorage
    localStorage.removeItem("authToken"); // Adjust key if needed
    sessionStorage.removeItem("authToken");

    // Redirect to login page after logout
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-xl font-bold">
      Logging out...
    </div>
  );
};

export default Logout;