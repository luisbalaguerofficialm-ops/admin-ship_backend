const express = require("express");
const {
  updateAdminEmail,
  updateAdminPassword,
  toggleNotifications,
  toggleTwoFactor,
  switchUser,
  deactivateAccount,
} = require("../controllers/settingController");

const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put("/email", protectAdmin, updateAdminEmail);
router.put("/password", protectAdmin, updateAdminPassword);
router.put("/notifications", protectAdmin, toggleNotifications);
router.put("/two-factor", protectAdmin, toggleTwoFactor);
router.post("/switch-user", protectAdmin, switchUser);
router.delete("/deactivate", protectAdmin, deactivateAccount);

module.exports = router;
