// routes/authAdminRoutes.js
const express = require("express");
const router = express.Router();

const {
  checkSuperAdmin,
  registerAdmin,
  loginAdmin,
} = require("../controllers/authAdminController");

const { protectAdmin } = require("../middlewares/authMiddleware");

/* =====================================================
   PUBLIC ROUTES (No Authentication Required)
===================================================== */

// Check if SuperAdmin exists (used for bootstrap UI)
router.get("/check-superadmin", checkSuperAdmin);

// Login Admin
router.post("/login", loginAdmin);

/* =====================================================
   MIXED ACCESS ROUTES
   - Public if NO SuperAdmin exists
   - Protected if SuperAdmin already exists
===================================================== */

// Register Admin
// - Any other admin → SuperAdmin JWT required
router.post("/register", registerAdmin);

/* =====================================================
   EXPORT
===================================================== */

module.exports = router;
