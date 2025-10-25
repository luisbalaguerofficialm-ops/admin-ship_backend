import express from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.put("/:id/read", markNotificationAsRead);

export default router;
