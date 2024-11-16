const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/refresh-token", authMiddleware, userController.refreshToken);

// Protected route
router.get("/:id", authMiddleware, userController.getUserDetails);

module.exports = router;
