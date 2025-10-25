// controllers/trackingController.js
import Tracking from "../models/Tracking.js";
import Shipment from "../models/Shipment.js";

export const addTrackingUpdate = async (req, res) => {
  try {
    const { shipmentId, status, location } = req.body;

    const update = await Tracking.create({ shipmentId, status, location });

    await Shipment.findByIdAndUpdate(shipmentId, {
      deliveryStatus: status,
      lastKnownLocation: location,
    });

    res.status(201).json({ success: true, tracking: update });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to add tracking update" });
  }
};

export const getTrackingHistory = async (req, res) => {
  try {
    const tracking = await Tracking.find({ shipmentId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, tracking });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tracking history" });
  }
};

export const deleteTrackingUpdate = async (req, res) => {
  try {
    await Tracking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Tracking update deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete tracking update" });
  }
};

export const updateTrackingUpdate = async (req, res) => {
  try {
    const updated = await Tracking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, tracking: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update tracking update" });
  }
};
s