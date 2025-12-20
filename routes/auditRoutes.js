const express = require("express");
const router = express.Router();

const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../controllers/agentController");

// Create agent
router.post("/", createAgent);

// Get all agents
router.get("/", getAgents);

// ✅ Get agent by ID
router.get("/:id", getAgentById);

// Update agent
router.put("/:id", updateAgent);

// Delete agent
router.delete("/:id", deleteAgent);

module.exports = router;
