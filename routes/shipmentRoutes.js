const express = require("express");
const router = express.Router();

const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../controllers/shipmentController");

router.post("/", createShipment);
router.get("/", getShipments);
router.get("/:id", getShipmentById);
router.put("/:id", updateShipment);
router.delete("/:id", deleteShipment);

module.exports = router;
