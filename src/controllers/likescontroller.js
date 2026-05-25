import prisma from "../utils/prisma.js";

//function for being able to like a user's post
export const like = async(req, res) => {
    try {
        const photoId = Number(req.params.photoid);
        const userId = req.user.userId;
        if (Number.isNaN(photoId)) {
            return res.status(400).json({error: "Invalid photo ID"});

        }
        const photo = await prisma.photo.findUnique({where: {id: photoId}});
        if (!photo) {
            return res.status(404).json({error: "Photo not found"});
        }
        const existingLike = await prisma.like.findFirst({
            where: {
                userId, photoId
            }
        });//if a user;s like already exists on a post, when user the clicks, the like counter will go down to unlike
        if (existingLike) {
            await prisma.like.delete({where: {id: existingLike.id}});
            return res.status(200).json({message: "unliked", liked: false});

        }
        //creating successful like
        await prisma.like.create({
            data: {
                userId: userId, photoId
            }
        });
        return res.status(201).json({message: "liked", liked: true});
    } catch (error) {
        console.error("like toggle error", error);
        return res.status(500).json({error: "server error whilst liking photo"});
    }
}