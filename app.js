// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// ====== Socket.IO Setup ======
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO available inside routes
app.set("io", io);

// Socket.IO events — optional log
io.on("connection", (socket) => {
  console.log("🔥 Admin Dashboard Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Admin Dashboard Disconnected:", socket.id);
  });
});

// ===== Middleware =====
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ===== Import routes =====
const shipmentRoutes = require("./routes/shipmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const publicTrackingRoutes = require("./routes/publicTrackingRoutes");
const auditRoutes = require("./routes/auditRoutes");
const contentRoutes = require("./routes/contentRoutes");
const settingRoutes = require("./routes/settingRoutes"); 
const branchRoutes = require("./routes/branchRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ===== Default Route =====
app.get("/", (req, res) => {
  res.status(200).send("✅ Shipment Admin API is running...");
});

// ===== API Routes =====
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/auth", authAdminRoutes); // login/register/check-superadmin
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/track", publicTrackingRoutes);
app.use("/api/audits", auditRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/report", reportRoutes);

// ===== 404 Fallback =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 4000;

// ===== Connect to MongoDB & Start Server =====
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});

    console.log(" Database connected successfully");

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log("🔌 Socket.IO is active...");
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
