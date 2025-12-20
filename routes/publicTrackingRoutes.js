const express = require("express");
const router = express.Router();
const { trackShipment } = require("../controllers/publicTrackingController");

// PUBLIC ROUTE
router.get("/:trackingNumber", trackShipment);

module.exports = router;
