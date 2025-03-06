const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// Password Validation Function
const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Admin Registration (Step 1 - Send OTP)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await sendEmail(email, "Your OTP Code", `Your OTP for registration is: ${otp}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashedPassword, otp, otpExpires });
    await admin.save();

    res.status(200).json({ message: "OTP sent to your email. Verify to complete registration." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP & Activate Admin
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    res.json({ message: "Admin verified successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerAdmin, verifyOTP };
