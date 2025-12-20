// controllers/auditController.js
const Audit = require("../models/Audit"); // Make sure you have an Audit model

// ===== CREATE AUDIT RECORD =====
const createAudit = async (req, res) => {
  try {
    const audit = await Audit.create(req.body); // e.g., { action, performedBy, details }
    res.status(201).json({ success: true, audit });
  } catch (err) {
    console.error("Create Audit Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create audit record" });
  }
};

// ===== GET ALL AUDITS =====
const getAudits = async (req, res) => {
  try {
    const audits = await Audit.find().sort({ createdAt: -1 });
    res.json({ success: true, audits });
  } catch (err) {
    console.error("Get Audits Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch audit records" });
  }
};

// ===== GET AUDIT BY ID =====
const getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit)
      return res.status(404).json({ message: "Audit record not found" });
    res.json({ success: true, audit });
  } catch (err) {
    console.error("Get Audit By ID Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch audit record" });
  }
};

// ===== DELETE AUDIT RECORD =====
const deleteAudit = async (req, res) => {
  try {
    const deleted = await Audit.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Audit record not found" });
    res.json({ success: true, message: "Audit record deleted" });
  } catch (err) {
    console.error("Delete Audit Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete audit record" });
  }
};

module.exports = {
  createAudit,
  getAudits,
  getAuditById,
  deleteAudit,
};
