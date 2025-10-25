import express from "express";
import { generateReport, getReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.get("/", getReports);

export default router;
