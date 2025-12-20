const authorizeRole =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Server error during authorization" });
    }
  };
