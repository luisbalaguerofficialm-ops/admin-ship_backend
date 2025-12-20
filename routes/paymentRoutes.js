const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

// ===== CREATE PAYMENT =====
router.post("/", async (req, res, next) => {
  try {
    await createPayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

// ===== GET ALL PAYMENTS =====
router.get("/", getPayments);

// ===== GET PAYMENT BY ID =====
router.get("/:id", getPaymentById);

// ===== UPDATE PAYMENT =====
router.put("/:id", async (req, res, next) => {
  try {
    await updatePayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

// ===== DELETE PAYMENT =====
router.delete("/:id", async (req, res, next) => {
  try {
    await deletePayment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("paymentsUpdated");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
