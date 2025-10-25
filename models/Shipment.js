const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    currentLocation: {
      type: String,
      default: "Warehouse",
    },

    // ✅ Admin who created the shipment
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // (Optional) If you later assign shipments to delivery agents
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Auto-generate tracking number if not provided
shipmentSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `TRK-${Math.floor(Math.random() * 1000000000)}`;
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
