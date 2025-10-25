// controllers/messageController.js
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete message" });
  }
};
