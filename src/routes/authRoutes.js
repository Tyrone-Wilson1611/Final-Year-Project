import { userRegistration, login } from "../controllers/authcontroller.js";
import express from "express";

const router = express.Router();


router.post("/Register", userRegistration);
router.post("/Login", login);

export default router;