const Payment = require("../models/Payment");
const Shipment = require("../models/Shipment");
const emitDashboardStats = require("../utils/dashboardEmitter");

// ===== RECORD NEW PAYMENT =====
const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Optionally mark shipment as paid
    if (payment.shipmentId) {
      await Shipment.findByIdAndUpdate(payment.shipmentId, {
        paymentStatus: "Paid",
      });
    }

    // 🔥 Emit dashboard update
    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.status(201).json({ success: true, payment });
  } catch (err) {
    console.error("Create Payment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to record payment" });
  }
};

// ===== GET ALL PAYMENTS =====
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("shipmentId")
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    console.error("Get Payments Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payments" });
  }
};

// ===== GET PAYMENT BY ID =====
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "shipmentId"
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ success: true, payment });
  } catch (err) {
    console.error("Get Payment By ID Error:", err);
    res.status(500).json({ success: false, message: "Error fetching payment" });
  }
};

// ===== UPDATE PAYMENT =====
const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // 🔥 Emit dashboard update
    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, payment: updated });
  } catch (err) {
    console.error("Update Payment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update payment" });
  }
};

// ===== DELETE PAYMENT =====
const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Payment not found" });

    // 🔥 Emit dashboard update
    const io = req.app.get("io");
    if (io) await emitDashboardStats(io);

    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Delete Payment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete payment" });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
