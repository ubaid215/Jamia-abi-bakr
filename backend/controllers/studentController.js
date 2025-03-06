const Student = require('../models/student');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ success: true, message: 'Student created successfully', student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 students per page
        const skip = (page - 1) * limit;
        const search = req.query.search || ""; // Search term

        // Define the query for searching
        const query = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } }, // Case-insensitive search by name
                    { fatherName: { $regex: search, $options: "i" } }, // Case-insensitive search by father's name
                    { permanentAddress: { $regex: search, $options: "i" } }, // Case-insensitive search by address
                    { phoneNumber: { $regex: search, $options: "i" } }, // Case-insensitive search by phone number
                ],
            }
            : {}; // If no search term, return all students

        const students = await Student.find(query).skip(skip).limit(limit);
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

// count total student 
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
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.status(200).json({ success: true, message: 'Student updated successfully', student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
