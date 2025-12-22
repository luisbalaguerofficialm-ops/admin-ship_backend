const Content = require("../models/Content");

// ===== CREATE CONTENT =====
const createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);

    // 🔴 SOCKET.IO LIVE UPDATE
    const io = req.app.get("io");
    if (io) {
      io.emit("contentUpdated", content);
      io.emit("dashboardUpdated");
    }

    res.status(201).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Create Content Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create content",
    });
  }
};

// ===== GET ALL CONTENTS =====
const getContents = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      contents,
    });
  } catch (err) {
    console.error("Get Contents Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contents",
    });
  }
};

// ===== GET CONTENT BY ID =====
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Get Content By ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
};

// ===== UPDATE CONTENT =====
const updateContent = async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // 🔴 SOCKET.IO LIVE UPDATE
    const io = req.app.get("io");
    if (io) {
      io.emit("contentUpdated", updated);
      io.emit("dashboardUpdated");
    }

    res.json({
      success: true,
      content: updated,
    });
  } catch (err) {
    console.error("Update Content Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update content",
    });
  }
};

// ===== DELETE CONTENT =====
const deleteContent = async (req, res) => {
  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // 🔴 SOCKET.IO LIVE UPDATE
    const io = req.app.get("io");
    if (io) {
      io.emit("contentUpdated", null);
      io.emit("dashboardUpdated");
    }

    res.json({
      success: true,
      message: "Content deleted",
    });
  } catch (err) {
    console.error("Delete Content Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete content",
    });
  }
};

module.exports = {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
};
