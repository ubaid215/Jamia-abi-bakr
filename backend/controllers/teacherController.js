const Teacher = require("../models/Teacher");
const fs = require("fs");
const path = require("path");

// Register a new teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { fullName, fatherName, cnic, phoneNumber, address, classType } = req.body; // Add classType
    const cvPath = req.file.path;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ cnic });
    if (existingTeacher) {
      // Delete the uploaded CV if teacher already exists
      fs.unlinkSync(cvPath);
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Create new teacher
    const newTeacher = new Teacher({
      fullName,
      fatherName,
      cnic,
      phoneNumber,
      address,
      classType, // Add classType
      cv: cvPath,
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Route to count total teachers
exports.getTotalTeachers = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments(); // Count all documents in the Teacher collection
    res.status(200).json({ success: true, totalTeachers });
  } catch (error) {
    console.error("Error counting teachers:", error);
    res.status(500).json({ success: false, message: "Failed to count teachers" });
  }
};

// Route to filter teachers by classType
exports.getTeachersByClassType = async (req, res) => {
  try {
    const { classType } = req.query;
    const teachers = await Teacher.find({ classType });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// teacherController.js

exports.getClassTypes = async (req, res) => {
  try {
    const classTypes = await Teacher.distinct("classType");
    res.status(200).json({ success: true, classTypes });
  } catch (error) {
    console.error("Error fetching class types:", error);
    res.status(500).json({ success: false, message: "Failed to fetch class types" });
  }
};