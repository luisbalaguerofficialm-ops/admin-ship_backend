// controllers/dashboardController.js
const Shipment = require("../models/Shipment");

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const delivered = await Shipment.countDocuments({ status: "Delivered" });
    const inTransit = await Shipment.countDocuments({ status: "In Transit" });
    const pending = await Shipment.countDocuments({ status: "Pending" });
    const cancelled = await Shipment.countDocuments({ status: "Cancelled" });

    const recentShipments = await Shipment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalShipments,
        delivered,
        inTransit,
        pending,
        cancelled,
      },
      recentShipments,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load dashboard data" });
  }
};

module.exports = { getDashboardStats };
