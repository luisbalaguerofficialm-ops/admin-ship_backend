// controllers/settingController.js
const Admin = require("../models/Admin");
const User = require("../models/User");
const emitDashboardStats = require("../utils/dashboardEmitter");
const bcrypt = require("bcryptjs");

// Update admin email
const updateAdminEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { email },
      { new: true }
    ).select("-password");

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, admin: updatedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update email" });
  }
};

// Update admin password
const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
};

// Toggle notifications
const toggleNotifications = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    admin.notifications = !admin.notifications;
    await admin.save();

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, notifications: admin.notifications });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to toggle notifications" });
  }
};

// Toggle two-factor authentication
const toggleTwoFactor = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    admin.twoFactorEnabled = !admin.twoFactorEnabled;
    await admin.save();

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, twoFactor: admin.twoFactorEnabled });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to toggle two-factor" });
  }
};

// Switch user
const switchUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, message: `Switched to user ${email}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to switch user" });
  }
};

// Deactivate admin account
const deactivateAccount = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.user.id);

    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, message: "Admin account deactivated" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to deactivate account" });
  }
};

module.exports = {
  updateAdminEmail,
  updateAdminPassword,
  toggleNotifications,
  toggleTwoFactor,
  switchUser,
  deactivateAccount,
};
