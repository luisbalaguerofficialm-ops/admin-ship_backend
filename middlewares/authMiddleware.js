const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * ✅ Protect routes using JWT authentication
 * Attaches the logged-in admin to req.user
 */
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin; // 👈 Attach the admin to the request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * ✅ Restrict access based on roles (e.g., SuperAdmin)
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

// ✅ Correct export syntax
module.exports = { protectAdmin, authorizeRole };
