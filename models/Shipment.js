const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    // ==========================
    // TRACKING
    // ==========================
    trackingNumber: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    // ==========================
    // CUSTOMER INFO
    // ==========================
    sender: {
      type: String,
      required: true,
      trim: true,
    },

    receiver: {
      type: String,
      required: true,
      trim: true,
    },

    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    receiverEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    receiverPhone: {
      type: String,
      trim: true,
    },

    // ==========================
    // ROUTE INFO
    // ==========================
    origin: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    currentLocation: {
      type: String,
      default: "Warehouse",
      trim: true,
    },

    route: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================
    // STATUS
    // ==========================
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Failed", "Cancelled"],
      default: "Pending",
    },

    lastUpdate: {
      type: Date,
      default: Date.now,
    },

    estimatedDelivery: {
      type: Date,
    },

    // ==========================
    // ADMIN / SYSTEM
    // ==========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },

    // ==========================
    // AUDIT / HISTORY
    // ==========================
    statusHistory: [
      {
        status: String,
        location: String,
        note: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// =================================================
// 🔐 SAFE AUTO TRACKING NUMBER GENERATION
// =================================================
shipmentSchema.pre("save", async function (next) {
  if (this.trackingNumber) return next();

  let isUnique = false;

  while (!isUnique) {
    const candidate = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const exists = await mongoose.models.Shipment.findOne({
      trackingNumber: candidate,
    });

    if (!exists) {
      this.trackingNumber = candidate;
      isUnique = true;
    }
  }

  next();
});

// =================================================
// 📦 AUTO-LOG STATUS HISTORY
// =================================================
shipmentSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      location: this.currentLocation,
    });

    this.lastUpdate = new Date();
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
