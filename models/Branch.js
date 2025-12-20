const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    contact: String,
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
