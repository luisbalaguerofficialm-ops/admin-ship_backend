// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * @desc Register Super Admin (only once)
 * @route POST /api/auth/register-superadmin
 * @access Public (first time only)
 */
const registerSuperAdmin = async (req, res) => {
  try {
    // Check if a Super Admin already exists
    const existingAdmin = await User.findOne({ role: "SuperAdmin" });
    if (existingAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Super Admin already exists" });
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "SuperAdmin",
    });

    return res.status(201).json({
      success: true,
      message: "Super Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Register SuperAdmin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Login user or admin
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get profile of logged-in user
 * @route GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  registerSuperAdmin,
  login,
  getProfile,
};
