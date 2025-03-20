const Teacher = require("../models/Teacher");
const fs = require("fs");
const path = require("path");

// Register a new teacher
const registerTeacher = async (req, res) => {
  try {
    const { fullName, fatherName, cnic, phoneNumber, address, classType } = req.body;
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
      classType,
      cv: cvPath,
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Count total teachers
const getTotalTeachers = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    // Return consistent format with classType information
    const classCounts = await Teacher.aggregate([
      { $group: { _id: "$classType", count: { $sum: 1 } } }
    ]);
    
    // Convert to a more usable format
    const countsByClass = {};
    classCounts.forEach(item => {
      countsByClass[item._id] = item.count;
    });
    
    res.status(200).json({ 
      success: true, 
      totalTeachers,
      classCounts: countsByClass 
    });
  } catch (error) {
    console.error("Error counting teachers:", error);
    res.status(500).json({ success: false, message: "Failed to count teachers" });
  }
};

// Filter teachers by classType
const getTeachersByClassType = async (req, res) => {
  try {
    const { classType } = req.query;
    const teachers = await Teacher.find({ classType });
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all unique class types
const getClassTypes = async (req, res) => {
  try {
    // Use the enum values from the schema instead of distinct query
    const classTypes = Teacher.schema.path('classType').enumValues;
    
    // If you want actual used values, use this approach
    const usedClassTypes = await Teacher.distinct("classType");
    
    console.log("Schema Class Types:", classTypes);
    console.log("Used Class Types:", usedClassTypes);
    
    res.status(200).json({ 
      success: true, 
      allClassTypes: classTypes, 
      usedClassTypes: usedClassTypes 
    });
  } catch (error) {
    console.error("Error fetching class types:", error);
    res.status(500).json({ success: false, message: "Failed to fetch class types", error: error.message });
  }
};

// Update teacher data
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Delete the associated CV file
    if (deletedTeacher.cv) {
      fs.unlinkSync(deletedTeacher.cv);
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export all functions
module.exports = {
  registerTeacher,
  getAllTeachers,
  getTeacherById,
  getTotalTeachers,
  getTeachersByClassType,
  getClassTypes,
  updateTeacher,
  deleteTeacher,
};