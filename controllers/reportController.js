const Report = require("../models/Report");

// ===== GENERATE NEW REPORT =====
const generateReport = async (req, res) => {
  try {
    const { title, data } = req.body;
    if (!title || !data) {
      return res
        .status(400)
        .json({ success: false, message: "Title and data are required" });
    }

    const report = await Report.create({
      title,
      data,
      generatedBy: req.user ? req.user._id : null,
    });

    // Emit real-time update to all connected clients
    const io = req.app.get("io");
    if (io) io.emit("reportsUpdated", report);

    res.status(201).json({ success: true, report });
  } catch (err) {
    console.error("Generate Report Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate report" });
  }
};

// ===== GET ALL REPORTS =====
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    console.error("Get Reports Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reports" });
  }
};

module.exports = { generateReport, getReports };
