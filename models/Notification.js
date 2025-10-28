const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["System", "Alert", "Shipment", "Payment"],
      default: "System",
    },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
