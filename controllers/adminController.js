// controllers/adminController.js
const Admin = require("../models/Admin");
const Shipment = require("../models/Shipment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Notification = require("../models/Notification");
const emitDashboardUpdate = require("../utils/dashboardEmitter");

/* =========================
   ADMINS
========================= */
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, admins });
  } catch (err) {
    console.error("Get Admins Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, admin });
  } catch (err) {
    console.error("Get Admin Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false });
    }

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({ success: true, admin });
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false });
    }

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    console.error("Delete Admin Error:", err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   DASHBOARD
========================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalShipments,
      delivered,
      inTransit,
      pending,
      cancelled,
      totalUsers,
      totalCustomers,
      totalPayments,
    ] = await Promise.all([
      Shipment.countDocuments(),
      Shipment.countDocuments({ status: "Delivered" }),
      Shipment.countDocuments({ status: "In Transit" }),
      Shipment.countDocuments({ status: "Pending" }),
      Shipment.countDocuments({ status: "Cancelled" }),
      User.countDocuments(),
      Customer.countDocuments(),
      Payment.countDocuments(),
    ]);

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
    console.error("Dashboard Error:", err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   PROFILE
========================= */
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.json({ success: true, admin });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    const io = req.app.get("io");
    if (io) await emitDashboardUpdate(io);

    res.json({ success: true, admin });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   NOTIFICATIONS
========================= */
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Notifications Error:", err);
    res.status(500).json({ success: false });
  }
};
