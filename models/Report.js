const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String }, // e.g., "daily", "monthly", etc.
    data: { type: mongoose.Schema.Types.Mixed }, // can store any report data
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
