const express = require("express");
const router = express.Router();

const {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getAdminNotifications,
} = require("../controllers/adminController");

const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// ===== DASHBOARD =====
router.get("/dashboard", protectAdmin, getDashboardStats);

// ===== PROFILE =====
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

// ===== ADMINS CRUD =====
// Get all admins (SuperAdmin only)
router.get("/", protectAdmin, authorizeRole("SuperAdmin"), getAdmins);

// Get single admin by ID (SuperAdmin only)
router.get("/:id", protectAdmin, authorizeRole("SuperAdmin"), getAdminById);

// Update admin by ID (SuperAdmin only)
router.put("/:id", protectAdmin, authorizeRole("SuperAdmin"), updateAdmin);

// Delete admin by ID (SuperAdmin only)
router.delete("/:id", protectAdmin, authorizeRole("SuperAdmin"), deleteAdmin);

// ===== NOTIFICATIONS =====
router.get("/notifications", protectAdmin, getAdminNotifications);

module.exports = router;
