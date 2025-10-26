// routes/adminRoutes.js
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
 */
router.get("/check-superadmin", async (req, res) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });
    return res.status(200).json({ superAdminExists: !!superAdminExists });
  } catch (error) {
    console.error("Error checking SuperAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ Register a new admin
 * - If a SuperAdmin exists, only that role can create new admins
 */
router.post("/register", async (req, res) => {
  try {
    const superAdminExists = await Admin.exists({ role: "SuperAdmin" });

    if (superAdminExists) {
      return verifyToken(req, res, async () => {
        await authorizeRoles("SuperAdmin")(req, res, async () => {
          await registerAdmin(req, res);
        });
      });
    } else {
      await registerAdmin(req, res);
    }
  } catch (error) {
    console.error("Error in /register:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ Login admin
 */
router.post("/login", loginAdmin);

/**
 * ✅ Manage admins (SuperAdmin only)
 */
router.get("/", verifyToken, authorizeRoles("SuperAdmin"), getAdmins);
router.put("/:id", verifyToken, authorizeRoles("SuperAdmin"), updateAdmin);
router.delete("/:id", verifyToken, authorizeRoles("SuperAdmin"), deleteAdmin);

export default router;
