// controllers/adminController.js
const Admin = require("../models/Admin");
const Shipment = require("../models/Shipment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Notification = require("../models/Notification");

// ========== CHECK SUPER ADMIN ==========
const checkSuperAdmin = async (req, res) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });
    res.json({
      success: true,
      exists: !!superAdminExists,
    });
  } catch (err) {
    console.error("Check SuperAdmin Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to check Super Admin" });
  }
};

// ========== DASHBOARD STATS ==========
const getDashboardStats = async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const deliveredShipments = await Shipment.countDocuments({
      deliveryStatus: "Delivered",
    });
    const inTransitShipments = await Shipment.countDocuments({
      deliveryStatus: "In Transit",
    });
    const pendingShipments = await Shipment.countDocuments({
      deliveryStatus: "Pending",
    });

    const totalUsers = await User.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const recentShipments = await Shipment.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalShipments,
          deliveredShipments,
          inTransitShipments,
          pendingShipments,
          totalUsers,
          totalCustomers,
          totalPayments,
        },
        recent: { shipments: recentShipments, payments: recentPayments },
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard data" });
  }
};

// ========== ADMIN PROFILE ==========
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ success: true, admin });
  } catch (err) {
    console.error("Get Admin Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");
    res.json({ success: true, admin: updatedAdmin });
  } catch (err) {
    console.error("Update Admin Profile Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

// ========== NOTIFICATIONS ==========
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Get Admin Notifications Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

module.exports = {
  checkSuperAdmin, // ✅ newly added
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getAdminNotifications,
};
