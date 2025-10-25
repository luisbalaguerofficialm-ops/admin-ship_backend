import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderType" },
    senderType: { type: String, enum: ["Admin", "Customer"], required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverType" },
    receiverType: { type: String, enum: ["Admin", "Customer"], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
