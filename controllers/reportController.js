// controllers/reportController.js
import Shipment from "../models/Shipment.js";
import Payment from "../models/Payment.js";

// Generate shipment report
export const getShipmentReport = async (req, res) => {
  try {
    const report = await Shipment.aggregate([
      {
        $group: {
          _id: "$deliveryStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({ success: true, report });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to generate shipment report" });
  }
};

// Generate financial summary
export const getFinancialReport = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({ success: true, totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to generate financial report" });
  }
};
