const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email address"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
