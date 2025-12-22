const router = require("express").Router();
const { protectAdmin } = require("../middlewares/authMiddleware");
const controller = require("../controllers/notificationController");

router.get("/", protectAdmin, controller.getNotifications);
router.put("/:id/read", protectAdmin, controller.markNotificationAsRead);
router.delete("/:id", protectAdmin, controller.deleteNotification);

module.exports = router;
