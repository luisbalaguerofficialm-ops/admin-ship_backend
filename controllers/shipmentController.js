const Shipment = require("../models/Shipment");
const emitDashboardStats = require("../utils/dashboardEmitter");

/**
 * Helper: emit real-time events and update dashboard
 */
const emitEvent = async (io, eventName, payload) => {
  if (io) {
    io.emit(eventName, payload);
    await emitDashboardStats(io);
    io.emit("dashboardUpdated");
  }
};

/**
 * Helper: standard response format
 */
const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({ success, message, ...data });
};

/**
 * @desc Create a new shipment
 * @route POST /api/shipments
 * @access Private (Admin or Super Admin)
 */
exports.createShipment = async (req, res) => {
  const io = req.app.get("io");
  try {
    const shipment = await Shipment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    await emitEvent(io, "shipment:new", shipment);

    sendResponse(res, 201, true, "Shipment created successfully", { shipment });
  } catch (err) {
    console.error("Create Shipment Error:", err);
    sendResponse(res, 500, false, "Failed to create shipment");
  }
};

/**
 * @desc Get all shipments
 * @route GET /api/shipments
 * @access Private
 */
exports.getShipments = async (req, res) => {
  try {
    const query =
      req.user.role !== "SuperAdmin" ? { createdBy: req.user.id } : {};
    const shipments = await Shipment.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, "Shipments fetched successfully", {
      shipments,
    });
  } catch (err) {
    console.error("Get Shipments Error:", err);
    sendResponse(res, 500, false, "Failed to fetch shipments");
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

    if (!shipment) return sendResponse(res, 404, false, "Shipment not found");

    // Access check
    if (
      req.user.role !== "SuperAdmin" &&
      shipment.createdBy._id.toString() !== req.user.id
    ) {
      return sendResponse(res, 403, false, "Access denied. Not your shipment.");
    }

    sendResponse(res, 200, true, "Shipment fetched successfully", { shipment });
  } catch (err) {
    console.error("Get Shipment Error:", err);
    sendResponse(res, 500, false, "Server error");
  }
};

/**
 * @desc Update shipment
 * @route PUT /api/shipments/:id
 * @access Private
 */
exports.updateShipment = async (req, res) => {
  const io = req.app.get("io");
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return sendResponse(res, 404, false, "Shipment not found");

    // Access check
    if (
      req.user.role !== "SuperAdmin" &&
      shipment.createdBy.toString() !== req.user.id
    ) {
      return sendResponse(res, 403, false, "Access denied.");
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    await emitEvent(io, "shipment:updated", updatedShipment);

    sendResponse(res, 200, true, "Shipment updated successfully", {
      shipment: updatedShipment,
    });
  } catch (err) {
    console.error("Update Shipment Error:", err);
    sendResponse(res, 500, false, "Failed to update shipment");
  }
};

/**
 * @desc Delete shipment
 * @route DELETE /api/shipments/:id
 * @access Private (Super Admin only)
 */
exports.deleteShipment = async (req, res) => {
  const io = req.app.get("io");
  try {
    if (req.user.role !== "SuperAdmin") {
      return sendResponse(res, 403, false, "Access denied. Super Admin only.");
    }

    const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!deletedShipment)
      return sendResponse(res, 404, false, "Shipment not found");

    await emitEvent(io, "shipment:deleted", deletedShipment._id);

    sendResponse(res, 200, true, "Shipment deleted successfully");
  } catch (err) {
    console.error("Delete Shipment Error:", err);
    sendResponse(res, 500, false, "Failed to delete shipment");
  }
};
