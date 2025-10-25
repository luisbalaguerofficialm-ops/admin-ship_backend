// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

/**
 * Middleware: Authenticate and attach admin user to request
 * Usage: router.get("/protected", protectAdmin, ...)
 */
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin details and attach to req.user
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found or unauthorized." });
    }

    req.user = admin;
    next(); // ✅ proceed to the next middleware or route
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { protectAdmin };
