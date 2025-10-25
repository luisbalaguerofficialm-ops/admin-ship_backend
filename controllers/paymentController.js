// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Shipment from "../models/Shipment.js";

// Record new payment
export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    // Optionally mark shipment as paid
    if (payment.shipmentId) {
      await Shipment.findByIdAndUpdate(payment.shipmentId, {
        paymentStatus: "Paid",
      });
    }
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to record payment" });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("shipmentId")
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payments" });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "shipmentId"
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching payment" });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, payment: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update payment" });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Payment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete payment" });
  }
};
