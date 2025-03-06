const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route to register a new student with auto profile creation
router.post('/register', studentController.createStudent);

// Route to get all students
router.get('/', studentController.getAllStudents);

// Get total number of students
router.get("/count", studentController.getTotalStudents);

// Route to get a single student by ID
router.get('/:id', studentController.getStudentById);


// Route to update a student
router.put('/:id', studentController.updateStudent);

// Route to delete a student
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
