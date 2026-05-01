import express from "express";
import { createProject, getProjects, addMember } from "../controllers/projectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, adminOnly, createProject);
router.get("/", protect, adminOnly, getProjects);
router.put("/:id/add-member", protect, adminOnly, addMember);

export default router;
