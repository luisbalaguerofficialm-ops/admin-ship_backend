// routes/authAdminRoutes.js
const express = require("express");
const router = express.Router();

const {
  checkSuperAdmin,
  registerAdmin,
  loginAdmin,
} = require("../controllers/authAdminController");

const { protectAdmin } = require("../middlewares/authMiddleware");

// ===== Check if SuperAdmin exists (Public) =====
router.get("/check-superadmin", checkSuperAdmin);

// ===== Register Admin =====
// First SuperAdmin (public) OR existing SuperAdmin (protected)
router.post("/register", protectAdmin, registerAdmin);

// ===== Login Admin (Public) =====
router.post("/login", loginAdmin);

module.exports = router;
