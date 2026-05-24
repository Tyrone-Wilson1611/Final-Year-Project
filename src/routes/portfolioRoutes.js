import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPortfolioUsername, updatePortfolio, deletePortfolio } from "../controllers/portfoliocontroller.js";

const router = express.Router();

router.get("/:username", getPortfolioUsername);
router.post("/profile/me", authMiddleware, updatePortfolio);
router.patch("/profile/me", authMiddleware, updatePortfolio);
router.delete("/profile/me", authMiddleware, deletePortfolio);

export default router;