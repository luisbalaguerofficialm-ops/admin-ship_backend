const Notification = require("../models/Notification");
const emitDashboardUpdate = require("../utils/dashboardEmitter");

// ===== CREATE NOTIFICATION =====
const createNotification = async (req, res) => {
  const io = req.app.get("io");

  try {
    const notification = await Notification.create(req.body);

    // 🔔 Emit real-time notification
    if (io) io.emit("notification:new", notification);

    // 🔥 Update dashboard instantly
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

// ===== GET ALL NOTIFICATIONS =====
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

// ===== MARK NOTIFICATION AS READ =====
const markNotificationAsRead = async (req, res) => {
  const io = req.app.get("io");

  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    // 🔥 Update dashboard unread count
    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.json({ success: true, notification: updated });
  } catch (err) {
    console.error("Mark Notification As Read Error:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

// ===== DELETE NOTIFICATION =====
const deleteNotification = async (req, res) => {
  const io = req.app.get("io");

  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Notification not found" });

    // 🔥 Refresh dashboard after deletion
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
