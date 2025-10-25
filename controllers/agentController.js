// controllers/agentController.js
import Agent from "../models/Agent.js";

export const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create agent" });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch agents" });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, agent: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update agent" });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete agent" });
  }
};
