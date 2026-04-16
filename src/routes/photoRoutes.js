import photocontroller from "photocontroller.js";
import express from "express";
import authMiddlewware from "authmiddleware.js";
import upload  from "uploadmiddleware";

const router = express.Router();

router.post("/uploadphoto",authMiddlewware, upload.single("image"), photocontroller.uploadPhotoImages);
router.get("/", photocontroller.getMultiplePhotos);

export default router;