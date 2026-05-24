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
        );
        upload_stream.end(buffer);
    });
}


export const uploadPhotoImages = async (req, res) => {
    try {
        const {title, type} = req.body;

        if (!req.file) {
            return res.status(400).json({error: "no image file uploaded"});
        }

        const result = await cloudinaryUpload (req.file.buffer);

        const photo = await prisma.photo.create({
            data:
            {title: title || null, imageUrl: result.secure_url, publicId: result.public_id, userId: req.user.userId, type: type || "post"}
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
            where: {
                type: "post"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                _count: {
                    select: {likes: true, comments: true}
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


export const getPhotobyId = async(req, res) => {
    try {
        const photoId = Number(req.params.id);
        if (Number.isNaN(photoId)) {
            return res.status(400).json({error: "Invalid photo ID"});
        }

        const photo = await prisma.photo.findUnique({
            where: {id: photoId},
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (!photo) {
            return res.status(404).json({error: "Photo not found"});
        }

        return res.status(200).json({photo});
    } catch (error) {
        console.error("issue accessing photo", error);
        return res.status(500).json({error: "There seems to be aserver error when trying to obtain the photo"});
    }
}