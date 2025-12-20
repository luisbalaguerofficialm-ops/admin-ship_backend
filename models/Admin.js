const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: [
        "SuperAdmin",
        "Admin",
        "BranchManager",
        "OperationsManager",
        "ITAdmin",
      ],
      default: "Admin",
    },
    active: {
      type: Boolean,
      default: true,
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Compare entered password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
