// controllers/branchController.js
import Branch from "../models/Branch.js";

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create branch" });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.json({ success: true, branches });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch branches" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const updated = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, branch: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update branch" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Branch deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete branch" });
  }
};
