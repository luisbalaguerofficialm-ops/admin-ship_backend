import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    body: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Content", contentSchema);
