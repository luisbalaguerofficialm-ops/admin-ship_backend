const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * @desc Register a new admin (SuperAdmin only — except the first one)
 * @route POST /api/admin/register
 * @access Public for first SuperAdmin, Private afterwards
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Count existing admins
    const adminCount = await Admin.countDocuments();

    // ✅ First SuperAdmin (no token required)
    if (adminCount === 0) {
      const superAdmin = await Admin.create({
        name,
        email,
        password, // pre-save hook will hash
        role: "SuperAdmin",
      });

      return res.status(201).json({
        success: true,
        message: "Super Admin created successfully",
        admin: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
        },
      });
    }

    // ✅ Only SuperAdmin can create more admins
    if (!req.user || req.user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Access denied. SuperAdmin only." });
    }

    // Prevent duplicates
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({
      name,
      email,
      password, // hashed in model pre-save
      role: role || "Admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Check if a SuperAdmin exists
 * @route GET /api/admin/check-superadmin
 * @access Public
 */
const checkSuperAdmin = async (req, res) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    res.status(200).json({
      success: true,
      superAdminExists: !!superAdminExists,
      message: superAdminExists
        ? "SuperAdmin already exists. Use /register with token to add new admins."
        : "No SuperAdmin found. You can register the first SuperAdmin.",
    });
  } catch (err) {
    console.error("Check SuperAdmin Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to check SuperAdmin",
    });
  }
};

/**
 * @desc Login admin
 * @route POST /api/admin/login
 * @access Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Update last login time
    admin.lastLogin = Date.now();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Reset admin password (via token)
 * @route PUT /api/admin/reset-password/:token
 * @access Public
 */
const resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token)
      return res.status(400).json({ message: "Reset token is required" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword; // pre-save hook hashes it
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete admin account (SuperAdmin only)
 * @route DELETE /api/admin/:id
 * @access Private (SuperAdmin)
 */
const deleteAdminAccount = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Access denied. SuperAdmin only." });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({
      success: true,
      message: "Admin account deleted successfully",
    });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  resetAdminPassword,
  deleteAdminAccount,
  checkSuperAdmin,
};
