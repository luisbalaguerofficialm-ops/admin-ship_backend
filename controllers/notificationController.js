// controllers/notificationController.js
import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create notification" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete notification" });
  }
};
