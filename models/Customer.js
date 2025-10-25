import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: String,
    phone: String,
    address: String,
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
