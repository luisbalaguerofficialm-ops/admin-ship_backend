const Report = require("../models/Report");

// Generate a new report
const generateReport = async (req, res) => {
  try {
    const { title, type, data } = req.body;

    const report = await Report.create({
      title,
      type,
      data,
      generatedBy: req.user ? req.user._id : null,
    });

    const io = req.app.get("io");
    if (io) io.emit("reportsUpdated"); // emit real-time update

    res.status(201).json({ success: true, report });
  } catch (err) {
    console.error("Generate Report Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate report" });
  }
};

// Get all reports
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
