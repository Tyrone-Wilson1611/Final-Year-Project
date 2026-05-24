import express, { Router } from "express";
import { getProfile, getUsername, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/:username", getUsername);

export default router;