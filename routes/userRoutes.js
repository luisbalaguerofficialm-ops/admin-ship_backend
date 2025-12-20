const express = require("express");
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create new user (Admin only)
router.post(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  registerUser
);

// Get all users (Admin only)
router.get("/", protectAdmin, authorizeRole("Admin", "SuperAdmin"), getUsers);

// Get single user by ID (Admin only)
router.get(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getUserById
);

// Update user (Admin only)
router.put(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  updateUser
);

// Delete user (Admin only)
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  deleteUser
);

module.exports = router;
