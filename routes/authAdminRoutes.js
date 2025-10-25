const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  resetAdminPassword,
  deleteAdminAccount,
} = require("../controllers/authAdminController");

const Admin = require("../models/Admin");
const { protectAdmin } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/authorizeRole");

const router = express.Router();

/**
 * @desc Register first SuperAdmin (public)
 *       Subsequent ones must use /register-admin with token
 * @route POST /api/admin/register
 */
router.post("/register", async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) return registerAdmin(req, res);
    res.status(403).json({
      message:
        "SuperAdmin already exists. Use /register-admin with token to add new admins.",
    });
  } catch (err) {
    console.error("Registration route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc Register new admin (SuperAdmin only)
 * @route POST /api/admin/register-admin
 */
router.post(
  "/register-admin",
  protectAdmin,
  authorizeRole("SuperAdmin"),
  registerAdmin
);

/**
 * @desc Login admin
 * @route POST /api/admin/login
 */
router.post("/login", loginAdmin);

/**
 * @desc Get admin profile
 * @route GET /api/admin/profile
 */
router.get("/profile", protectAdmin, getAdminProfile);

/**
 * @desc Reset password
 * @route PUT /api/admin/reset-password
 */
router.put("/reset-password", protectAdmin, resetAdminPassword);

/**
 * @desc Delete admin account (SuperAdmin only)
 * @route DELETE /api/admin/:id
 */
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("SuperAdmin"),
  deleteAdminAccount
);

module.exports = router;
