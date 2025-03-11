const Student = require("../models/student");
const fs = require("fs"); // For file system operations
const path = require("path"); // For handling file paths

// Upload student's profile image
exports.uploadStudentImage = async (req, res) => {
  try {
    const studentId = req.params.id;
    const imageFile = req.file; // Uploaded file details

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    // Update the student's profile image in the database
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { profileImage: `/uploads/${imageFile.filename}` }, // Save the file path to the database
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student image uploaded successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload father's image
exports.uploadFatherImage = async (req, res) => {
  try {
    const studentId = req.params.id;
    const imageFile = req.file; // Uploaded file details

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    // Update the father's image in the database
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { fatherImage: `/uploads/${imageFile.filename}` }, // Save the file path to the database
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Father image uploaded successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    // Get the total number of students to generate roll and admission numbers
    const totalStudents = await Student.countDocuments();

    // Generate rollNumber and admissionNumber
    const rollNumber = totalStudents + 1; // Auto-increment roll number
    const admissionNumber = `ADM-${Date.now()}`; // Unique admission number based on timestamp

    // Add auto-generated fields to the request body
    const studentData = {
      ...req.body,
      rollNumber,
      admissionNumber,
    };

    // Create the student
    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all students with filters and sorting
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 10 students per page
    const skip = (page - 1) * limit;

    // Extract query parameters
    const search = req.query.search || ""; // Search term
    const startDate = req.query.startDate || ""; // Start date for admission date filter
    const endDate = req.query.endDate || ""; // End date for admission date filter
    const classType = req.query.classType || ""; // Class type filter
    const sortBy = req.query.sortBy || ""; // Sorting criteria

    // Define the base query
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } }, // Case-insensitive search by name
        { fatherName: { $regex: search, $options: "i" } }, // Case-insensitive search by father's name
        { rollNumber: { $regex: search, $options: "i" } }, // Case-insensitive search by roll number
      ];
    }

    // Add date range filter
    if (startDate && endDate) {
      query.dateOfAdmission = {
        $gte: new Date(startDate), // Greater than or equal to start date
        $lte: new Date(endDate), // Less than or equal to end date
      };
    }

    // Add class type filter
    if (classType) {
      query.classType = classType;
    }

    // Define sorting criteria
    let sortCriteria = {};
    if (sortBy) {
      switch (sortBy) {
        case "fullName":
          sortCriteria = { fullName: 1 }; // Sort by name (A-Z)
          break;
        case "-fullName":
          sortCriteria = { fullName: -1 }; // Sort by name (Z-A)
          break;
        case "dateOfAdmission":
          sortCriteria = { dateOfAdmission: 1 }; // Sort by admission date (oldest first)
          break;
        case "-dateOfAdmission":
          sortCriteria = { dateOfAdmission: -1 }; // Sort by admission date (newest first)
          break;
        default:
          sortCriteria = {}; // No sorting
      }
    }

    // Fetch students with filters, sorting, and pagination
    const students = await Student.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // Count total students matching the query
    const totalStudents = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      students,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Count total students
exports.getTotalStudents = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    res.status(200).json({ success: true, totalStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// studentController.js

exports.migrateStudent = async (req, res) => {
  try {
    const { studentId, newClassType } = req.body;

    // Step 1: Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Step 2: Find a teacher for the new class type
    const teacher = await Teacher.findOne({ classType: newClassType });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "No teacher found for the new class type" });
    }

    // Step 3: Update the student's classType and teacherName
    student.classType = newClassType;
    student.teacherName = teacher.fullName; // Update the teacher's name

    // Save the updated student
    await student.save();

    res.status(200).json({
      success: true,
      message: "Student migrated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In studentController.js
exports.getPoorPerformers = async (req, res) => {
  try {
    const allStudents = await Student.find(); // Fetch all students
    const poorPerformers = [];

    for (const student of allStudents) {
      const hasPoorPerformance = await checkWeeklyPerformance(student._id);
      if (hasPoorPerformance) {
        poorPerformers.push(student);
      }
    }

    res.status(200).json({ success: true, students: poorPerformers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};