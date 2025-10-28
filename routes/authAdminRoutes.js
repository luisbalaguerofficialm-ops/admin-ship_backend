// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Controllers
const {
  registerAdmin,
  loginAdmin,
  resetAdminPassword,
  deleteAdminAccount,
  checkSuperAdmin,
} = require("../controllers/authAdminController"); // Authentication & account logic

const {
  getAdminProfile,
  updateAdminProfile,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAdminNotifications,
} = require("../controllers/adminController"); // Admin management & stats

// ✅ Middlewares
const { protectAdmin } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/authorizeRole");

// ✅ Models
const Admin = require("../models/Admin");

// =====================================
// 🔍 SUPER ADMIN CHECK
// =====================================
router.get("/check-superadmin", checkSuperAdmin);

// =====================================
// 🔐 AUTHENTICATION ROUTES
// =====================================

// ✅ Register first SuperAdmin
router.post("/register", async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      // Allow first SuperAdmin registration
      return registerAdmin(req, res);
    }

    res.status(403).json({
      message:
        "SuperAdmin already exists. Use /register-admin with SuperAdmin token to add new admins.",
    });
  } catch (err) {
    console.error("Error checking SuperAdmin existence:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Register new admin (SuperAdmin only)
router.post(
  "/register-admin",
  protectAdmin,
  authorizeRole("SuperAdmin"),
  registerAdmin
);

// ✅ Admin login
router.post("/login", loginAdmin);

// ✅ Reset password (logged-in admins)
router.put("/reset-password", protectAdmin, resetAdminPassword);

// =====================================
// 👤 ADMIN PROFILE
// =====================================
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

// =====================================
// 🧭 ADMIN MANAGEMENT (SuperAdmin only)
// =====================================
router.get("/", protectAdmin, authorizeRole("SuperAdmin"), getAdmins);
router.put("/:id", protectAdmin, authorizeRole("SuperAdmin"), updateAdmin);
router.delete("/:id", protectAdmin, authorizeRole("SuperAdmin"), deleteAdmin);

// =====================================
// 📊 DASHBOARD & 🔔 NOTIFICATIONS
// =====================================
router.get("/dashboard", protectAdmin, getDashboardStats);
router.get("/notifications", protectAdmin, getAdminNotifications);

// =====================================
// 🧹 DELETE OWN ACCOUNT (SuperAdmin only)
// =====================================
router.delete(
  "/delete-account/:id",
  protectAdmin,
  authorizeRole("SuperAdmin"),
  deleteAdminAccount
);

// =====================================
// ✅ EXPORT ROUTER
// =====================================
module.exports = router;
