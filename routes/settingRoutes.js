const express = require("express");
const router = express.Router();

const {
  getAdminSettings,
  updateAdminEmail,
  updateAdminPassword,
  toggleNotifications,
  toggleTwoFactor,
  switchUser,
  deactivateAccount,
} = require("../controllers/settingsController");

const { protectAdmin } = require("../middlewares/authMiddleware");

/**
 * ================================
 * ADMIN SETTINGS ROUTES
 * Base path: /api/settings
 * ================================
 */

// 🔹 Get admin settings
router.get("/", protectAdmin, getAdminSettings);

// 🔹 Update admin email
router.put("/email", protectAdmin, updateAdminEmail);

// 🔹 Update admin password
router.put("/password", protectAdmin, updateAdminPassword);

// 🔹 Toggle email notifications
router.put("/notifications", protectAdmin, toggleNotifications);

// 🔹 Toggle two-factor authentication
router.put("/twofactor", protectAdmin, toggleTwoFactor);

// 🔹 Switch user (admin impersonation)
router.post("/switchuser", protectAdmin, switchUser);

// 🔹 Deactivate admin account
router.delete("/deactivate", protectAdmin, deactivateAccount);

module.exports = router;
