const Notification = require("../models/Notification");
const emitDashboardUpdate = require("../utils/dashboardEmitter");

/**
 * CREATE NOTIFICATION
 * Used internally (shipments, payments, etc.)
 */
const createNotification = async (req, res) => {
  const io = req.app.get("io");

  try {
    const { user, message, type = "info" } = req.body;

    const notification = await Notification.create({
      user,
      message,
      type,
    });

    // 🔔 Emit only to target user
    if (io && user) {
      io.to(user.toString()).emit("notification:new", notification);
    }

    // 🔥 Update dashboard stats
    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error("Create Notification Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create notification" });
  }
};

/**
 * GET USER NOTIFICATIONS
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

/**
 * MARK AS READ
 */
const markNotificationAsRead = async (req, res) => {
  const io = req.app.get("io");

  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.json({ success: true, notification: updated });
  } catch (err) {
    console.error("Mark Read Error:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

/**
 * DELETE NOTIFICATION
 */
const deleteNotification = async (req, res) => {
  const io = req.app.get("io");

  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete Notification Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete notification" });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
};
