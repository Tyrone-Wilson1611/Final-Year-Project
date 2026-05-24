import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { followUser, unfollow } from "../controllers/followcontroller.js";

const router = express.Router();

router.post("/follow/:userId", authMiddleware, followUser);
router.delete("/unfollow/:userId", authMiddleware, unfollow);

export default router;