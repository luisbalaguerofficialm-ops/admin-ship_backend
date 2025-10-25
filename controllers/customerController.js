// controllers/customerController.js
import Customer from "../models/Customer.js";

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, customer });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create customer" });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch customers" });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, customer: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update customer" });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete customer" });
  }
};
