import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Auto delete after 1 hour
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);
export default Token;
