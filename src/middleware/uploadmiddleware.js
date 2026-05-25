import multer from "multer";
//responsible for photo upload storage
const uploadStorage = multer.memoryStorage();

const upload = multer({
    storage: uploadStorage, limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const fileTypes = ["image/jpeg", "image/png", "image/webp, image/RAW"];

        if (fileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only RAW, JPEG, PNG and WEBP files are allowed in this instace, we apologise for any inconvenience"));
        }
    }
})

export default upload;