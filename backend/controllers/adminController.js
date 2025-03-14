const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// Register Admin
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create a new admin with the role field (no manual hashing)
    const admin = new Admin({
      name,
      email,
      password: password, // The model middleware will hash this
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found:", email);
      return res.status(400).json({ message: "Admin not found" });
    }

    console.log("Stored Hashed Password in DB:", admin.password);
    console.log("Entered Password:", password);

    // Ensure the stored password is hashed
    if (!admin.password || admin.password.length < 20) {
      console.log("Stored password is not hashed properly:", admin.password);
      return res.status(500).json({ message: "Server error: Password not hashed properly" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Invalid password attempt for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Generate a reset token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Create the reset link
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: admin.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Reset Password Error:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to send reset link" });
  }
};

// Verify Reset Token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Token is valid", adminId: admin._id });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    await Admin.findByIdAndUpdate(adminId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};