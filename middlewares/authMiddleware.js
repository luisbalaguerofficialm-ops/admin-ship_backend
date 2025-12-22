const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protectAdmin = async (req, res, next) => {
  try {
    // Check if any SuperAdmin exists
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    //BOOTSTRAP MODE:
    // If no SuperAdmin exists yet, allow request to continue
    if (!superAdminExists) {
      req.isBootstrap = true; // mark request
      return next();
    }

    // Normal protected flow
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error("ProtectAdmin Error:", err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
