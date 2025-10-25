import express from "express";
import { logAudit, getAuditLogs } from "../controllers/auditController.js";

const router = express.Router();

router.post("/", logAudit);
router.get("/", getAuditLogs);

export default router;
