const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/reset-password", adminController.resetPassword);

// Password reset routes
router.post("/reset-password", adminController.resetPassword); // Send reset link
router.get("/verify-reset-token/:token", adminController.verifyResetToken); // Verify token
router.post("/update-password", adminController.updatePassword); // Update password

// Protected routes
router.get("/profile", authMiddleware, adminController.getProfile);

module.exports = router;