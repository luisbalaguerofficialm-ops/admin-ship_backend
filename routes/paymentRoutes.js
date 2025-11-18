import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create Payment → emit event
router.post("/", async (req, res, next) => {
  try {
    await createPayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

// Get all payments
router.get("/", getPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Update Payment → emit event
router.put("/:id", async (req, res, next) => {
  try {
    await updatePayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

// Delete Payment → emit event
router.delete("/:id", async (req, res, next) => {
  try {
    await deletePayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

export default router;
