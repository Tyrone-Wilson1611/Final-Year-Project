import {uploadPhotoImages, getMultiplePhotos, getPhotobyId} from "../controllers/photocontroller.js";
import {like} from "../controllers/likescontroller.js";
import {commentCreate, PhotoComments} from "../controllers/commentscontroller.js";
import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.post("/uploadphoto", authMiddleware, upload.single("image"), uploadPhotoImages);
router.get("/", getMultiplePhotos);
router.get("/:id", getPhotobyId);
router.post("/:photoid/likes", authMiddleware, like);
router.post("/:photoid/comments", authMiddleware, commentCreate);
router.get("/:photoid/comments", PhotoComments);

export default router;
