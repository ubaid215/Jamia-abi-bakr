// import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth";

// export const loginAdmin = async (email, password) => {
//   try {
//     const { data } = await axios.post(`${API_URL}/login`, { email, password });
//     return data;
//   } catch (error) {
//     throw error.response.data.message;
//   }
// };

// export const registerAdmin = async (name, email, password) => {
//   try {
//     const { data } = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
//     return data;
//   } catch (error) {
//     throw error.response.data.message;
//   }
// };

// export const verifyAdminOTP = async (email, otp) => {
//   try {
//     const { data } = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
//     return data;
//   } catch (error) {
//     throw error.response.data.message;
//   }
// };
