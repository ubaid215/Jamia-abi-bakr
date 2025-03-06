import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerAdmin, sendOTP } from "../api/authApi"; 
import { Link, useNavigate } from "react-router-dom";
import registerImage from "../assets/register.jpg";
import AstImg from "../assets/img-2.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSendOTP = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    try {
      await sendOTP(email);
      setOtpSent(true);
      setError("");
      setSuccess("OTP sent to your email!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include 1 uppercase letter & 1 special character.");
      return;
    }
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    try {
      await registerAdmin(name, email, password, otp);
      setSuccess("Admin registered successfully! You can now log in.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid OTP or registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-cover bg-center py-20 px-52" style={{ backgroundImage: `url(${registerImage})` }}>
      <div id="left" className="w-[40%] bg-cover bg-center h-full shadow-2xl rounded-l-2xl" style={{ backgroundImage: `url(${AstImg})` }}></div>
      <div id="right" className="w-[60%] h-full p-10 bg-white shadow-2xl rounded-r-2xl">
        <div className="relative w-96 mx-auto bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Registration</h2>

          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-2 border rounded mb-4" 
              onChange={(e) => setName(e.target.value)} 
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-2 border rounded mb-4" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <button 
              type="button" 
              className="w-full my-2 bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 transition" 
              onClick={handleSendOTP}
            >
              Send OTP
            </button>

            {otpSent && (
              <input 
                type="text" 
                placeholder="Enter OTP" 
                className="w-full p-2 border rounded mb-4" 
                onChange={(e) => setOtp(e.target.value)} 
                required
              />
            )}

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full p-2 border rounded" 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <span 
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            
            <button 
              type="submit" 
              className="w-full my-4 bg-green-500 text-white py-2 rounded cursor-pointer hover:bg-green-600 transition"
            >
              Register
            </button>
            <Link to="/login" className="text-blue-400 hover:text-blue-700 hover:underline">
              Already have an account?
            </Link>
          </form>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
