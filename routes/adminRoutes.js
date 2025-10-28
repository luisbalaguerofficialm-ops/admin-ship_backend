// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ============================
// 🧠 CONTROLLERS
// ============================
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/authAdminController");

const {
  checkSuperAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getAdminNotifications,
} = require("../controllers/adminController");

// ============================
// 🛡️ MIDDLEWARES
// ============================
const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// 🔍 SUPER ADMIN CHECK
// ============================
router.get("/check-superadmin", checkSuperAdmin);

// ============================
// 🔐 AUTHENTICATION ROUTES
// ============================

// ✅ Register new admin (first one freely, others by SuperAdmin)
router.post("/register", async (req, res, next) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    // Allow the first SuperAdmin to register freely
    if (!superAdminExists) {
      return registerAdmin(req, res);
    }

    // Otherwise require SuperAdmin auth
    protectAdmin(req, res, async (err) => {
      if (err) return next(err);
      authorizeRole("SuperAdmin")(req, res, async (err) => {
        if (err) return next(err);
        await registerAdmin(req, res);
      });
    });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Admin login
router.post("/login", loginAdmin);

// ============================
// 👥 ADMIN MANAGEMENT (SuperAdmin only)
// ============================
router.get("/", protectAdmin, authorizeRole("SuperAdmin"), getAdmins);
router.put("/:id", protectAdmin, authorizeRole("SuperAdmin"), updateAdmin);
router.delete("/:id", protectAdmin, authorizeRole("SuperAdmin"), deleteAdmin);

// ============================
// 📊 DASHBOARD & PROFILE
// ============================
router.get("/dashboard", protectAdmin, getDashboardStats);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

// ============================
// 🔔 NOTIFICATIONS
// ============================
router.get("/notifications", protectAdmin, getAdminNotifications);

// ============================
// ✅ EXPORT ROUTER
// ============================
module.exports = router;
