// LoginPage.jsx
import  { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import loginImage from "../../assets/login.jpg";
import AstImg from "../../assets/bgImg.jpg";
// import { Link } from "react-router-dom";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-cover bg-center py-20 px-20" style={{ backgroundImage: `url(${loginImage})` }}>
      <div className='w-[70%] h-full flex'>
      <div id="left" className="w-[60%] h-full p-10 bg-white shadow-2xl rounded-l-2xl">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-2 border rounded mb-4" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
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
                onClick={togglePasswordVisibility}
              >
                 {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <button 
              type="submit" 
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded mb-6 hover:bg-blue-600 transition"
            >
              Login
            </button>

            <div className="flex justify-between text-sm">
              <a to="/forgot-password" className="text-blue-400 hover:text-blue-700 hover:underline">
                Forgot Password?
              </a>
              <a to="/register" className="text-blue-400 hover:text-blue-700 hover:underline">
                {`Don't have an account?`}
              </a>
            </div>
          </form>

          {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}
        </div>
      </div>
      <div id="right" className="w-[40%] bg-cover bg-center h-full shadow-2xl rounded-r-2xl" style={{ backgroundImage: `url(${AstImg})` }}></div>
      </div>
      
    </div>
  );
};

export default Login;
