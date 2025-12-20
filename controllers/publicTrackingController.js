const Shipment = require("../models/Shipment");
const TrackingUpdate = require("../models/TrackingUpdate");

const trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    if (!trackingNumber) {
      console.log("❌ No tracking number provided");
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    const shipment = await Shipment.findOne({ trackingNumber }).select(
      "trackingNumber status currentLocation origin destination estimatedDelivery statusHistory updatedAt"
    );

    if (!shipment) {
      console.log("❌ Shipment NOT FOUND for:", trackingNumber);
      return res.status(404).json({
        success: false,
        message: "Invalid tracking ID",
      });
    }

    const history = await TrackingUpdate.find({
      shipment: shipment._id,
    }).sort({ createdAt: -1 });

    console.log("🕓 TRACKING HISTORY COUNT:", history.length);

    res.json({
      success: true,
      message: "Shipment found",
      shipment,
      history,
    });
  } catch (err) {
    console.error("🔥 Track Shipment Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to track shipment",
    });
  }
};

module.exports = { trackShipment };
