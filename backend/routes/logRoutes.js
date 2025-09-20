import express from "express";
import { createLog, getLogs } from "../controllers/logController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/', protect, createLog);
router.get('/', protect, admin, getLogs);

export default router;
