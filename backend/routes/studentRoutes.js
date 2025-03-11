const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer'); // Import multer for file uploads

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

// Route to upload student's profile image
router.post('/:id/upload-student-image', upload.single('image'), studentController.uploadStudentImage);

// Route to upload father's image
router.post('/:id/upload-father-image', upload.single('image'), studentController.uploadFatherImage);

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

// studentMigrate.js
router.post("/migrate", studentController.migrateStudent);

// Migrate history Route
router.get("/:id/migration-history", studentController.getMigrationHistory);


module.exports = router;
