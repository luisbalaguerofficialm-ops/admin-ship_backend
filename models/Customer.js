const mongoose = require("mongoose");

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

module.exports = mongoose.model("Customer", customerSchema);
