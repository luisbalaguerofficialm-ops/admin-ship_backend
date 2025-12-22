// utils/dashboardEmitter.js
const Shipment = require("../models/Shipment");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
 const Message = require("../models/Message");

/**
 * Emit live dashboard stats via Socket.IO
 * @param {object} io - Socket.IO server instance
 */
const emitDashboardStats = async (io) => {
  if (!io) return;

  try {
    // Shipments
    const totalShipments = await Shipment.countDocuments();
    const delivered = await Shipment.countDocuments({ status: "Delivered" });
    const inTransit = await Shipment.countDocuments({ status: "In Transit" });
    const pending = await Shipment.countDocuments({ status: "Pending" });
    const cancelled = await Shipment.countDocuments({ status: "Cancelled" });

    // Users
    const totalUsers = await User.countDocuments();

   

const emitDashboardUpdate = async (io) => {
  const unreadMessages = await Message.countDocuments({
    isRead: false,
  });

  io.emit("dashboard:stats", {
    unreadMessages,
  });
};

module.exports = emitDashboardUpdate;


    // Customers
    const totalCustomers = await Customer.countDocuments();

    // Payments
    const paymentsData = await Payment.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalPayments = paymentsData[0]?.totalAmount || 0;

    // Unread notifications
    const unreadNotifications = await Notification.countDocuments({
      read: false,
    });

    // Emit to all connected clients
    io.emit("dashboard:update", {
      stats: {
        totalShipments,
        delivered,
        inTransit,
        pending,
        cancelled,
        totalUsers,
        totalCustomers,
        totalPayments,
        unreadNotifications,
      },
    });

    console.log("📊 Dashboard stats emitted");
  } catch (err) {
    console.error("❌ Error emitting dashboard stats:", err);
  }
};

module.exports = emitDashboardStats;
