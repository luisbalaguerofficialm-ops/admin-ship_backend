const Customer = require("../models/Customer");

// ===== CREATE CUSTOMER =====
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    // Emit real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("customersUpdated"); // specific event
      io.emit("dashboardUpdated"); // unified dashboard event
    }

    res.status(201).json({ success: true, customer });
  } catch (err) {
    console.error("Create Customer Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create customer" });
  }
};

// ===== GET ALL CUSTOMERS =====
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    console.error("Get Customers Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch customers" });
  }
};

// ===== GET CUSTOMER BY ID =====
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ success: true, customer });
  } catch (err) {
    console.error("Get Customer By ID Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch customer" });
  }
};

// ===== UPDATE CUSTOMER =====
const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Customer not found" });

    // Emit real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("customersUpdated");
      io.emit("dashboardUpdated");
    }

    res.json({ success: true, customer: updated });
  } catch (err) {
    console.error("Update Customer Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update customer" });
  }
};

// ===== DELETE CUSTOMER =====
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Customer not found" });

    // Emit real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("customersUpdated");
      io.emit("dashboardUpdated");
    }

    res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    console.error("Delete Customer Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete customer" });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
