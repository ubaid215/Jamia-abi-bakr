const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const upload = require("../config/multer");

// Register a new teacher
router.post("/register", upload.single("cv"), teacherController.registerTeacher);

// Get all teachers
router.get("/", teacherController.getAllTeachers);

// Get the total number of teachers (Move this above `/:id`)
router.get("/count", teacherController.getTotalTeachers);

// Get all unique class types
router.get("/class-types", teacherController.getClassTypes);

// Filter teachers by classType
router.get("/filter", teacherController.getTeachersByClassType);

// Get a single teacher by ID (This should be after static routes)
router.get("/:id", teacherController.getTeacherById);

// Update a teacher by ID
router.put("/update/:id", teacherController.updateTeacher);

// Delete a teacher by ID
router.delete("/delete/:id", teacherController.deleteTeacher);

module.exports = router;
