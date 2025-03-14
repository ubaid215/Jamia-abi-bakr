/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Renamed from `admin` to `user` for clarity
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch user profile on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Set user data (admin or user)
          setAuthenticated(true);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token'); // Clear invalid token
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData); 
    setAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthenticated(false);
  };

  // Update user profile
  const updateUser = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  // Check if the user is an admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        logout,
        updateUser,
        isAdmin, // Add this function to check admin role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};