const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await Admin.findOne({ role: "superadmin" });
    if (existing) {
      console.log("❌ Super Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const superAdmin = await Admin.create({
      name: "Super Admin",
      email: "superadmin@admin.com",
      password: hashedPassword,
      role: "SuperAdmin",
      notifications: true,
      twoFactorEnabled: false,
    });

    console.log("Super Admin created successfully");
    console.log({
      email: superAdmin.email,
      password: "admin123",
    });

    process.exit();
  } catch (err) {
    console.error("❌ Error creating super admin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
