const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const upload = require("../config/multer"); // Correct import path

// Register a new teacher
router.post("/register", upload.single("cv"), teacherController.registerTeacher);

// Get all teachers
router.get("/", teacherController.getAllTeachers);

router.get("/count", teacherController.getTotalTeachers);

// teacherRoutes.js
router.get("/class-types", teacherController.getClassTypes);

// Get teachers by classType
router.get("/filter", async (req, res) => {
    try {
      const { classType } = req.query;
      const teachers = await Teacher.find({ classType });
      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

module.exports = router;