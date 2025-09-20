
import express from "express";
import { registerUser, loginUser, getUserProfile, resetPassword, updateUserProfile, createAdmin, createSupport } from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create-admin", protect, admin, createAdmin);
router.post("/create-support", protect, admin, createSupport);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
