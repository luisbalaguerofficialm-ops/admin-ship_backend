import User from "../models/User.js";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    // Emit event for live dashboard updates
    const io = req.app.get("io");
    if (io) io.emit("usersUpdated");

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    // Emit event for live dashboard updates
    const io = req.app.get("io");
    if (io) io.emit("usersUpdated");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    // Emit event for live dashboard updates
    const io = req.app.get("io");
    if (io) io.emit("usersUpdated");

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
