import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    details: String,
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model("Audit", auditSchema);
