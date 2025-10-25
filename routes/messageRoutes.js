import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getMessages);
router.put("/:id/read", markAsRead);

export default router;
