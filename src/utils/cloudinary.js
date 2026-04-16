import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotev.config();

cloudinary.config({
    cloud_name: process.eventNames.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
