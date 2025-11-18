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

// ===== Default Route =====
app.get("/", (req, res) => {
  res.status(200).send("✅ Shipment Admin API is running...");
});

// ===== API Routes =====
app.use("/api/shipments", shipmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authAdminRoutes);

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
