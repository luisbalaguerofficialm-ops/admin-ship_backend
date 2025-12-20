const express = require("express");
const router = express.Router();

// Import controllers
const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../controllers/shipmentController");

// Import middlewares
const {
  protectAdmin,
  authorizeRole,
} = require("../middlewares/authMiddleware");

// CRUD routes
router.post(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  createShipment
);
router.get(
  "/",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getShipments
);
router.get(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  getShipmentById
);
router.put(
  "/:id",
  protectAdmin,
  authorizeRole("Admin", "SuperAdmin"),
  updateShipment
);
router.delete(
  "/:id",
  protectAdmin,
  authorizeRole("SuperAdmin"),
  deleteShipment
);

module.exports = router;
