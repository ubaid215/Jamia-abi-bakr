const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer'); // For handling file uploads

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Route to upload student's profile image
router.post('/:id/upload-student-image', upload.single('image'), studentController.uploadStudentImage);

// Route to upload father's image
router.post('/:id/upload-father-image', upload.single('image'), studentController.uploadFatherImage);

// Route to upload documents (e.g., B-Form, CNIC, etc.)
router.post('/:id/upload-documents', upload.array('documents', 5), studentController.uploadDocuments);

// Route to register a new student
router.post('/register', studentController.createStudent);

// Route to get all students
router.get('/', studentController.getAllStudents);

// Route to get the total number of students
router.get('/count', studentController.getTotalStudents);

// Route to get a single student by ID
router.get('/:id', studentController.getStudentById);

// Route to update a student
router.put('/:id', studentController.updateStudent);

// Route to delete a student
router.delete('/:id', studentController.deleteStudent);

// Route to migrate a student to a new class
router.post('/migrate', studentController.migrateStudent);

// Route to get migration history for a student
router.get('/:id/migration-history', studentController.getMigrationHistory);

// Route to delete a document
router.delete('/:id/delete-document', studentController.deleteDocument);

module.exports = router;