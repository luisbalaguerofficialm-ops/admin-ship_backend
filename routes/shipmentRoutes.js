const express = require("express");
const router = express.Router();

const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../controllers/shipmentController");

// Create Shipment → emit event
router.post("/", async (req, res, next) => {
  try {
    await createShipment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("shipmentsUpdated");
  } catch (err) {
    next(err);
  }
});

// Get all Shipments
router.get("/", getShipments);

// Get Shipment by ID
router.get("/:id", getShipmentById);

// Update Shipment → emit event
router.put("/:id", async (req, res, next) => {
  try {
    await updateShipment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("shipmentsUpdated");
  } catch (err) {
    next(err);
  }
});

// Delete Shipment → emit event
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteShipment(req, res);
    const io = req.app.get("io");
    if (io) io.emit("shipmentsUpdated");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
