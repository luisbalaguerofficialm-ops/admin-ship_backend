// controllers/settingController.js
import Setting from "../models/Setting.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json({ success: true, settings });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update settings" });
  }
};
