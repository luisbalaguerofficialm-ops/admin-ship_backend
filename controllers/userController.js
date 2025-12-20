const bcrypt = require("bcryptjs");
const User = require("../models/User");
const emitDashboardStats = require("../utils/dashboardEmitter");

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    const io = req.app.get("io");

    // Socket events
    if (io) {
      io.emit("user:created", user);
      await emitDashboardStats(io);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Register User Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
};

// ================= GET USERS =================
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// ================= GET USER BY ID =================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    const io = req.app.get("io");
    if (io) {
      io.emit("user:updated", updatedUser);
      await emitDashboardStats(io);
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    if (io) {
      io.emit("user:deleted", req.params.id);
      await emitDashboardStats(io);
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// ================= EXPORT =================
module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
