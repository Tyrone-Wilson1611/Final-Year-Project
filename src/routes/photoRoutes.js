import {uploadPhotoImages, getMultiplePhotos} from "../controllers/photocontroller.js";
import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.post("/uploadphoto", authMiddleware, upload.single("image"), uploadPhotoImages);
router.get("/", getMultiplePhotos);

export default router;
