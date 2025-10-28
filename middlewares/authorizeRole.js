/**
 * @desc Middleware to restrict access based on user roles
 * @param {...string} allowedRoles - e.g. "SuperAdmin", "Admin"
 * @usage router.post("/something", protectAdmin, authorizeRole("SuperAdmin"), handler)
 */

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure the request is authenticated and has a user attached by protectAdmin
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Check if user role is authorized
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: You do not have sufficient permissions",
        });
      }

      // Proceed if authorized
      next();
    } catch (error) {
      console.error("Authorization middleware error:", error.message);
      res.status(500).json({ message: "Server error during authorization" });
    }
  };
};

module.exports = { authorizeRole };
