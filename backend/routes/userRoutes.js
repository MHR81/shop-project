import express from "express";
import { registerUser, authUser } from "../controllers/userController.js";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);

// روت‌های مدیریت کاربران توسط ادمین
import { protect, admin } from "../middleware/authMiddleware.js";
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
