// controllers/contentController.js
import Content from "../models/Content.js";

export const createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    res.status(201).json({ success: true, content });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create content" });
  }
};

export const getContents = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json({ success: true, contents });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contents" });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, content: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update content" });
  }
};

export const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Content deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete content" });
  }
};
