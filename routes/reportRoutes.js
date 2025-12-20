const express = require("express");
const {
  generateReport,
  getReports,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/generate", generateReport);
router.get("/", getReports);

module.exports = router;
