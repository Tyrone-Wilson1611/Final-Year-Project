import { userRegistration, login } from "../controllers/authcontroller.js";
import express from "express";

const router = express.Router();


router.post("/register", userRegistration);
router.post("/login", login);

export default router;