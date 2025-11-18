// utils/dashboardEmitter.js
const Shipment = require("../models/Shipment");
const User = require("../models/User");
const Payment = require("../models/Payment");

/**
 * Emit live dashboard stats via Socket.IO
 * @param {object} io - Socket.IO server instance
 */
const emitDashboardStats = async (io) => {
  try {
    // Total shipments
    const shipmentsCount = await Shipment.countDocuments();

    // Total users
    const usersCount = await User.countDocuments();

    // Total payments processed (sum of amount)
    const paymentsData = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const paymentsCount = paymentsData[0]?.totalAmount || 0;

    // Pending deliveries (shipments with status not 'Delivered')
    const pendingDeliveriesCount = await Shipment.countDocuments({
      deliveryStatus: { $ne: "Delivered" },
    });

    // Emit to all connected clients
    io.emit("dashboard:update", {
      shipments: shipmentsCount,
      users: usersCount,
      payments: paymentsCount,
      pendingDeliveries: pendingDeliveriesCount,
    });

    console.log("📊 Dashboard stats emitted");
  } catch (err) {
    console.error("❌ Error emitting dashboard stats:", err);
  }
};

module.exports = emitDashboardStats;
