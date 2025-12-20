const Branch = require("../models/Branch");

// ===== CREATE BRANCH =====
const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (err) {
    console.error("Create Branch Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create branch" });
  }
};

// ===== GET ALL BRANCHES =====
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.json({ success: true, branches });
  } catch (err) {
    console.error("Get Branches Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch branches" });
  }
};

// ===== GET BRANCH BY ID =====
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });

    res.json({ success: true, branch });
  } catch (err) {
    console.error("Get Branch By ID Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch branch" });
  }
};

// ===== UPDATE BRANCH =====
const updateBranch = async (req, res) => {
  try {
    const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, branch: updated });
  } catch (err) {
    console.error("Update Branch Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update branch" });
  }
};

// ===== DELETE BRANCH =====
const deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Branch deleted" });
  } catch (err) {
    console.error("Delete Branch Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete branch" });
  }
};

module.exports = {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
