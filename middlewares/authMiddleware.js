const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ===============================
// PROTECT ADMIN (AUTH)
// ===============================
exports.protectAdmin = async (req, res, next) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    // Bootstrap mode (first SuperAdmin)
    if (!superAdminExists) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error("ProtectAdmin Error:", err);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ===============================
// AUTHORIZE ROLE (RBAC)
// ===============================
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};
