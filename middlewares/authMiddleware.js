const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

// Protect admin routes
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });

    req.user = admin;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Protect user routes
const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Role-based authorization
const authorizeRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: insufficient role" });
    }
    next();
  };

module.exports = { protectAdmin, protectUser, authorizeRole };
