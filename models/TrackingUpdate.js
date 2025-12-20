const mongoose = require("mongoose");

const trackingUpdateSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackingUpdate", trackingUpdateSchema);
