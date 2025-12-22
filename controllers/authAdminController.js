const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

/**
 * GET /api/admin/check-superadmin
 * Public
 */
const checkSuperAdmin = async (req, res) => {
  try {
    const exists = await Admin.exists({ role: "SuperAdmin" });
    res.json({ success: true, superAdminExists: !!exists });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * POST /api/admin/register
 * Protected BUT bootstrap-safe
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const adminCount = await Admin.countDocuments();

    // FIRST SUPERADMIN (bootstrap mode)
    if (adminCount === 0) {
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

    // AFTER bootstrap → must be SuperAdmin
    if (!req.user || req.user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ success: false, message: "SuperAdmin only" });
    }

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "Admin",
    });

    res.status(201).json({ success: true, admin });
  } catch (err) {
    console.error("Register Admin Error:", err);
    res.status(500).json({ success: false });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, admin });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  checkSuperAdmin,
  registerAdmin,
  loginAdmin,
};
