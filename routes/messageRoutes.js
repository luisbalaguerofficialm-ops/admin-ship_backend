const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");

const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// Send message
router.post(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  sendMessage
);

// Get messages
router.get(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getMessages
);

// Mark as read
router.put(
  "/:id/read",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  markAsRead
);




// Delete message
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  deleteMessage
);

module.exports = router;
