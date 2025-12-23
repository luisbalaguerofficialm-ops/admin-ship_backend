// controllers/authAdminController.js
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

/**
 * @desc Check if SuperAdmin exists
 * @route GET /api/admin/check-superadmin
 * @access Public
 */
exports.checkSuperAdmin = async (req, res) => {
  try {
    const exists = await Admin.exists({ role: "SuperAdmin" });
    res.json({
      success: true,
      superAdminExists: Boolean(exists),
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
 * @desc Register Admin
 * @route POST /api/admin/register
 * @access Public (first SuperAdmin) | Protected (SuperAdmin)
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    // 🚀 BOOTSTRAP MODE (NO TOKEN REQUIRED)
    if (!superAdminExists) {
      const superAdmin = await Admin.create({
        name,
        email: email.toLowerCase(),
        password,
        role: "SuperAdmin",
      });

      return res.status(201).json({
        success: true,
        message: "SuperAdmin created",
        admin: superAdmin,
      });
    }

    // 🔐 AFTER BOOTSTRAP → SUPERADMIN ONLY
    if (!req.user || req.user.role !== "SuperAdmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin only",
      });
    }

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "Admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created",
      admin,
    });
  } catch (err) {
    console.error("Register Admin Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to register admin",
    });
  }
};

/**
 * @desc Login Admin
 * @route POST /api/admin/login
 * @access Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    console.error("Login Admin Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
