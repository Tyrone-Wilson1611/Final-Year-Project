import cloudinary from "../utils/cloudinary.js";
import prisma from "../utils/prisma.js";

const cloudinaryUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
            {folder: "photoport"}, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result)
            }
        )
    })
}


export const uploadPhotoImages = async (req, res) => {
    try {
        const {title} = req.body;

        if (!req.file) {
            return res.status(400).json({error: "no image file uploaded"});
        }

        const result = await cloudinaryUpload (req.file.buffer);

        const photo = await prisma.photo.create({
            data:
            {title: title || null, imageUrl: result.secure_url, publicId: result.public_id, userId: req.user.userId}
        });

        return res.status(201).json({
            message: "image has been uploaded successfully", photo
        })
    } catch (error) {
        console.error("Image upload error", error);
        return res.status(500).json({error: "there was a server error when uploading an image"})
    }
}


export const getMultiplePhotos = async(req, res) => {
    try {
        const photos = await prisma.photo.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({photos});
    } catch(error) {
        console.error("multiple photo access issue", error)
        return res.status(500).json({error: "there was a server error when trying to obtain multiple photos"});
    }
}