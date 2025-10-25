import mongoose from "mongoose";

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

export default mongoose.model("Notification", notificationSchema);
