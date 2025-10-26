// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const shipmentRoutes = require("./routes/shipmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");

const app = express();

// ===== Middleware =====
app.use(cors({ origin: "*", credentials: true })); // Allow frontend to connect
app.use(express.json());

// ===== Default Route =====
app.get("/", (req, res) => {
  res.status(200).send("✅ Shipment Admin API is running...");
});

// ===== API Routes =====
app.use("/api/shipments", shipmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", authAdminRoutes); // Handles super admin registration, login, etc.

// ===== 404 Fallback (Prevents HTML error pages) =====
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
