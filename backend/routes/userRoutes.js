const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin-only routes
router.post("/create", authMiddleware, userController.createUser);
router.put("/toggle-status/:userId", authMiddleware, userController.toggleUserStatus);
router.get("/all", authMiddleware, userController.getAllUsers);

module.exports = router;