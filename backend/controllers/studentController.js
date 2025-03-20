const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const Teacher = require('../models/Teacher');

// Helper function for checking weekly performance
async function checkWeeklyPerformance(studentId) {
  // Implement your performance check logic here
  return false; // Placeholder return
}

// Upload student's profile image
const uploadStudentImage = async (req, res) => {
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
const uploadFatherImage = async (req, res) => {
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

// Upload documents (e.g., B-Form, CNIC, etc.)
const uploadDocuments = async (req, res) => {
  try {
    const studentId = req.params.id;
    const files = req.files; // Array of uploaded files

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Save file paths to the student's documents field
    const documentPaths = files.map((file) => `/uploads/${file.filename}`);
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $push: { documents: { $each: documentPaths } } }, // Add new documents to the array
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new student
const createStudent = async (req, res) => {
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
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 students per page
    const skip = (page - 1) * limit;

    // Validate page and limit
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ success: false, message: "Invalid page or limit value" });
    }

    // Extract query parameters
    const search = req.query.search || ""; // Search term
    const startDate = req.query.startDate || ""; // Start date for admission date filter
    const endDate = req.query.endDate || ""; // End date for admission date filter
    const classType = req.query.classType || ""; // Class type filter
    const sortBy = req.query.sortBy || ""; // Sorting criteria

    // Validate date formats
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({ success: false, message: "Invalid startDate format" });
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({ success: false, message: "Invalid endDate format" });
    }

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
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Count total students
const getTotalStudents = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    // Get counts by class type
    const classCounts = await Student.aggregate([
      { $group: { _id: "$classType", count: { $sum: 1 } } }
    ]);
    
    // Convert to a more usable format
    const countsByClass = {};
    classCounts.forEach(item => {
      countsByClass[item._id] = item.count;
    });
    
    res.status(200).json({ 
      success: true, 
      totalStudents,
      classCounts: countsByClass 
    });
  } catch (error) {
    console.error("Error counting students:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all unique class types
const getClassTypes = async (req, res) => {
  try {
    console.log("Fetching student class types..."); // Debugging
    
    // Use the enum values from the schema instead of distinct query
    const classTypes = Student.schema.path('classType').enumValues;
    
    // If you want actual used values, use this approach
    const usedClassTypes = await Student.distinct("classType");
    
    console.log("Schema Class Types:", classTypes);
    console.log("Used Class Types:", usedClassTypes);
    
    res.status(200).json({ 
      success: true, 
      allClassTypes: classTypes, 
      usedClassTypes: usedClassTypes 
    });
  } catch (error) {
    console.error("Error fetching student class types:", error);
    res.status(500).json({ success: false, message: "Failed to fetch class types", error: error.message });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
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
const updateStudent = async (req, res) => {
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
const deleteStudent = async (req, res) => {
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

// Student Migration Function
const migrateStudent = async (req, res) => {
  try {
    const { studentId, newClassType, fromClassType } = req.body;
    console.log("Migrating student:", studentId, fromClassType, "->", newClassType); // Debugging

    // Validate input data
    if (!studentId || !newClassType) {
      return res.status(400).json({ success: false, message: "Missing studentId or newClassType" });
    }

    // Perform migration logic
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Store the current class type before updating
    const oldClassType = student.classType;
    
    // Add migration record to history
    student.migrationHistory.push({
      date: new Date(),
      fromClass: oldClassType,
      toClass: newClassType,
      migratedBy: req.body.migratedBy || "Admin"
    });
    
    // Update the class type
    student.classType = newClassType;
    await student.save();

    res.status(200).json({ 
      success: true, 
      message: "Student migrated successfully",
      student
    });
  } catch (error) {
    console.error("Error migrating student:", error); // Debugging
    res.status(500).json({ success: false, message: "Failed to migrate student", error: error.message });
  }
};

// Mirgrated Student History
const getMigrationHistory = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      migrationHistory: student.migrationHistory || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get poor performers
const getPoorPerformers = async (req, res) => {
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

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const { documentPath } = req.body;
    const studentId = req.params.id;

    // Remove the document from the student's documents array
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $pull: { documents: documentPath } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Delete the file from the server
    const filePath = path.join(__dirname, `../${documentPath}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
    }

    res.status(200).json({ success: true, message: "Document deleted successfully", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students by class type
const getStudentsByClassType = async (req, res) => {
  try {
    const { classType } = req.query;
    const students = await Student.find({ classType });
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadStudentImage,
  uploadFatherImage,
  uploadDocuments,
  createStudent,
  getAllStudents,
  getTotalStudents,
  getClassTypes,
  getStudentById,
  updateStudent,
  deleteStudent,
  migrateStudent,
  getMigrationHistory,
  getPoorPerformers,
  deleteDocument,
  getStudentsByClassType
};