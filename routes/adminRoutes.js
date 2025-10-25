import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} from "../controllers/authAdminController.js";
import Admin from "../models/Admin.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Check if a SuperAdmin already exists
 * Used by frontend to decide whether to show Register or Login first.
 */
router.get("/check-superadmin", async (req, res) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });
    res.json({ superAdminExists: !!superAdminExists });
  } catch (error) {
    console.error("Error checking SuperAdmin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Register a new admin
 * - First SuperAdmin can be created freely (if none exists)
 * - After that, only an existing SuperAdmin can register new users
 */
router.post("/register", async (req, res, next) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    if (superAdminExists) {
      // Require authentication to create other admins
      return verifyToken(req, res, async () => {
        await authorizeRoles("SuperAdmin")(req, res, async () => {
          await registerAdmin(req, res);
        });
      });
    } else {
      // First-time setup: allow SuperAdmin creation
      await registerAdmin(req, res);
    }
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Login route
 */
router.post("/login", loginAdmin);

/**
 * ✅ Protected admin management routes
 * - Only SuperAdmin can manage other admins
 */
router.get("/", verifyToken, authorizeRoles("SuperAdmin"), getAdmins);
router.put("/:id", verifyToken, authorizeRoles("SuperAdmin"), updateAdmin);
router.delete("/:id", verifyToken, authorizeRoles("SuperAdmin"), deleteAdmin);

export default router;
