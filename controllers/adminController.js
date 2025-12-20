const Admin = require("../models/Admin");
const Shipment = require("../models/Shipment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Notification = require("../models/Notification");
const emitDashboardUpdate = require("../utils/dashboardEmitter");

// ===== GET ALL ADMINS =====
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Get Admins Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== GET ADMIN BY ID =====
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error("Get Admin by ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== UPDATE ADMIN =====
const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== DELETE ADMIN =====
const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== DASHBOARD STATS =====
const getDashboardStats = async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const delivered = await Shipment.countDocuments({ status: "Delivered" });
    const inTransit = await Shipment.countDocuments({ status: "In Transit" });
    const pending = await Shipment.countDocuments({ status: "Pending" });
    const cancelled = await Shipment.countDocuments({ status: "Cancelled" });

    const totalUsers = await User.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const recentShipments = await Shipment.find().sort({ createdAt: -1 });
    const recentPayments = await Payment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      stats: {
        totalShipments,
        delivered,
        inTransit,
        pending,
        cancelled,
        totalUsers,
        totalCustomers,
        totalPayments,
      },
      recent: {
        shipments: recentShipments,
        payments: recentPayments,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

// ===== ADMIN PROFILE =====
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.json({ success: true, admin });
  } catch (err) {
    console.error("Get Admin Profile Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({ success: true, admin });
  } catch (err) {
    console.error("Update Admin Profile Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

// ===== NOTIFICATIONS =====
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Get Admin Notifications Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getAdminNotifications,
};
