import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: String,
    logo: String,
    supportEmail: String,
    maintenanceMode: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
