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

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Shipment Admin API is running...");
});

const port = process.env.PORT || 4000;

// API Routes
app.use("/api/shipments", shipmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", authAdminRoutes); // handles super admin registration, login, etc.

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
module.exports = app;

// MONGO_URL=mongodb+srv://sofiavergaravertical_db_user:BUZzXk9T9DI0u8bE@cluster0.ylngraf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// PORT=4000
// JWT_SECRET=holy_forever_is-thy_sandwiches_1276
