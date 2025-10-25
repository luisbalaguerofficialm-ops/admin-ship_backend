import express from "express";
import {
  addTrackingUpdate,
  getTrackingHistory,
} from "../controllers/trackingController.js";

const router = express.Router();

router.post("/", addTrackingUpdate);
router.get("/:id", getTrackingHistory);

export default router;
