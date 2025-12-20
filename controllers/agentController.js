const Agent = require("../models/Agent");

// ===== CREATE AGENT =====
const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, agent });
  } catch (err) {
    console.error("Create Agent Error:", err);
    res.status(500).json({ success: false, message: "Failed to create agent" });
  }
};

// ===== GET ALL AGENTS =====
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ success: true, agents });
  } catch (err) {
    console.error("Get Agents Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch agents" });
  }
};

// ===== GET AGENT BY ID =====
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    res.json({ success: true, agent });
  } catch (err) {
    console.error("Get Agent By ID Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch agent" });
  }
};

// ===== UPDATE AGENT =====
const updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, agent: updated });
  } catch (err) {
    console.error("Update Agent Error:", err);
    res.status(500).json({ success: false, message: "Failed to update agent" });
  }
};

// ===== DELETE AGENT =====
const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Agent deleted" });
  } catch (err) {
    console.error("Delete Agent Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete agent" });
  }
};

module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};
