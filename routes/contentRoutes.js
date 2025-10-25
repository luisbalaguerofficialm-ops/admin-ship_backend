import express from "express";
import {
  createContent,
  getContents,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";

const router = express.Router();

router.post("/", createContent);
router.get("/", getContents);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

export default router;
