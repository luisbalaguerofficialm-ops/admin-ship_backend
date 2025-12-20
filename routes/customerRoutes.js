// routes/customerRoutes.js
const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// ===== CUSTOMER ROUTES =====
router.post(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  createCustomer
);
router.get(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getCustomers
);
router.get(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getCustomerById
);
router.put(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  updateCustomer
);
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  deleteCustomer
);

module.exports = router;
