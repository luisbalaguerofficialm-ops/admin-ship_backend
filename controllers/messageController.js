const Message = require("../models/Message");
const emitDashboardUpdate = require("../utils/dashboardEmitter");
const sendEmail = require("../utils/sendEmail");


// =====================================
// SEND NEW MESSAGE
// =====================================
const sendMessage = async (req, res) => {
  const io = req.app.get("io");

  try {
    const message = await Message.create(req.body);

    // 🔔 Emit real-time message
    if (io) {
      io.emit("message:new", message);
    }

    // 🔥 Update dashboard instantly
    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// =====================================
// GET ALL MESSAGES
// =====================================
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// =====================================
// MARK MESSAGE AS READ
// =====================================
const markAsRead = async (req, res) => {
  const io = req.app.get("io");

  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true }, // ✅ FIXED FIELD
      { new: true }
    );

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // 🔥 Update dashboard
    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.status(200).json({
      success: true,
      message: msg,
    });
  } catch (err) {
    console.error("Mark Message As Read Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark as read",
    });
  }
};

// =====================================
// DELETE MESSAGE
// =====================================
const deleteMessage = async (req, res) => {
  const io = req.app.get("io");

  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // 🔔 Emit real-time delete
    if (io) {
      io.emit("message:deleted", deleted._id);
    }

    // 🔥 Update dashboard
    if (io) {
      await emitDashboardUpdate(io);
      io.emit("dashboardUpdated");
    }

    res.status(200).json({
      success: true,
      message: "Message deleted",
    });
  } catch (err) {
    console.error("Delete Message Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};



// ===== REPLY TO MESSAGE =====
exports.replyToMessage = async (req, res) => {
  const { reply } = req.body;
  const message = await Message.findById(req.params.id);

  if (!message) return res.status(404).json({ message: "Message not found" });

  await sendEmail({
    to: message.senderEmail,
    subject: `Re: ${message.subject}`,
    html: `
      <p>Hello ${message.senderName},</p>
      <p>${reply}</p>
      <br />
      <p>Regards,<br/>Support Team</p>
    `,
  });

  res.json({ success: true, message: "Reply sent successfully" });
};

// =====================================
// EXPORTS
// =====================================
module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};
