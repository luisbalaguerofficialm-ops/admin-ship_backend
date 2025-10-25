// controllers/shipmentController.js
const Shipment = require("../models/Shipment");

/**
 * @desc Create a new shipment
 * @route POST /api/shipments
 * @access Private (Admin or Super Admin)
 */
exports.createShipment = async (req, res) => {
  try {
    // Automatically assign the admin who created the shipment
    const shipment = await Shipment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment,
    });
  } catch (err) {
    console.error("Create Shipment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create shipment" });
  }
};

/**
 * @desc Get all shipments
 * @route GET /api/shipments
 * @access Private
 * - Admins see only their own shipments
 * - Super Admin sees all
 */
exports.getShipments = async (req, res) => {
  try {
    let query = {};

    // Regular Admins only see their own shipments
    if (req.user.role !== "SuperAdmin") {
      query = { createdBy: req.user.id };
    }

    const shipments = await Shipment.find(query)
      .populate("createdBy", "name email role") // show admin info
      .sort({ createdAt: -1 });

    res.json({ success: true, shipments });
  } catch (err) {
    console.error("Get Shipments Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch shipments" });
  }
};

/**
 * @desc Get single shipment by ID
 * @route GET /api/shipments/:id
 * @access Private
 */
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    // Restrict access for regular admins
    if (
      req.user.role !== "SuperAdmin" &&
      shipment.createdBy._id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. Not your shipment." });
    }

    res.json({ success: true, shipment });
  } catch (err) {
    console.error("Get Shipment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Update shipment
 * @route PUT /api/shipments/:id
 * @access Private (Owner or Super Admin)
 */
exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    // Only the creator or Super Admin can update
    if (
      req.user.role !== "SuperAdmin" &&
      shipment.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You cannot update this shipment." });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Shipment updated successfully",
      shipment: updatedShipment,
    });
  } catch (err) {
    console.error("Update Shipment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update shipment" });
  }
};

/**
 * @desc Delete shipment
 * @route DELETE /api/shipments/:id
 * @access Private (Super Admin only)
 */
exports.deleteShipment = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only." });
    }

    const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!deletedShipment)
      return res.status(404).json({ message: "Shipment not found" });

    res.json({
      success: true,
      message: "Shipment deleted successfully",
    });
  } catch (err) {
    console.error("Delete Shipment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete shipment" });
  }
};
