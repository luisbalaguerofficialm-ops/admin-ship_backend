const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// Create notification
router.post(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  createNotification
);

// Get notifications
router.get(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getNotifications
);

// Mark as read
router.put(
  "/:id/read",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  markNotificationAsRead
);

// Delete notification
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  deleteNotification
);

module.exports = router;
