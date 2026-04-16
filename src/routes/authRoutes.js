import authController from "authcontroller.js";
import express from "express";

const router = express.Router();


router.post("/Register", authController.userRegistration);
router.post("/Login", authController.login);

export default router;