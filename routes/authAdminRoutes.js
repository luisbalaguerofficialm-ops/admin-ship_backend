const express = require("express");
const router = express.Router();

const {
  checkSuperAdmin,
  registerAdmin,
  loginAdmin,
} = require("../controllers/authAdminController");

const { protectAdmin } = require("../middlewares/authMiddleware");

// PUBLIC
router.get("/check-superadmin", checkSuperAdmin);
router.post("/login", loginAdmin);

// ALWAYS PROTECTED (bootstrap-safe)
router.post("/register", protectAdmin, registerAdmin);

module.exports = router;
