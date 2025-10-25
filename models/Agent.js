import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    assignedShipments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
