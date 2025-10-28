// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ===== Import routes =====
const shipmentRoutes = require("./routes/shipmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");

// ===== Default Route =====
app.get("/", (req, res) => {
  res.status(200).send("✅ Shipment Admin API is running...");
});

// ===== API Routes =====
// Shipment management
app.use("/api/shipments", shipmentRoutes);

// Dashboard data
app.use("/api/dashboard", dashboardRoutes);

// Admin account management (includes check-superadmin & register)
app.use("/api/admin", adminRoutes);

// Authentication routes (login, profile, reset password, etc.)
app.use("/api/auth", authAdminRoutes);

// ===== 404 Fallback =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 4000;

// ===== Connect to MongoDB & Start Server =====
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
