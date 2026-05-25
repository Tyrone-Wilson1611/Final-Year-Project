import prisma from "../utils/prisma.js";
//checks for photoid and turns it into a number first before allowing user to comment
export const commentCreate = async (req, res) => {
    try {
        const photoId = Number(req.params.photoid);
        const { text } = req.body;
        if (Number.isNaN(photoId)) {
            return res.status(400).json({error: "Invalid photo ID"});
        }
        if (!text || text.trim() === "") {
            return res.status(400).json({error: "Comment text cannot be empty"});
        }
        //checking if photo id exists
        const photo = await prisma.photo.findUnique({where: {id: photoId}});
        if (!photo) {
            return res.status(404).json({error: "Photo not found"});

        }
        //if photoId exists, comment can now be created
        const comment = await prisma.comment.create({
            data: {
                text, photoId, userId: req.user.userId
            }, include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });
        return res.status(201).json({message: "Comment created successfully", comment});
    } catch (error) {
        console.error("there was an error when creating a comment", error);
        return res.status(500).json({error: "there was a server error when creating a comment"});
    }
};
// allows users to be able to see other users' comments on a post
export const PhotoComments = async (req, res) => {
    try {
        const photoId = Number(req.params.photoid);
        if (Number.isNaN(photoId)) {
            return res.status(400).json({error: "Invalid photo ID"});
    }
        const comments = await prisma.comment.findMany({
            where: {photoId},
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
        return res.status(200).json({comments});
    } catch (error) {
        console.error("get comments error", error);
        return res.status(500).json({error: "there was a server error when trying to obtain comments for a photo"});
    }
};
    //checks to see if comment id exists, if it exists then the comment is deleted
export const commentdeletion = async (req, res) => {
    try {const commentId = Number(req.params.commentid);

        if (Number.isNaN(commentId)) {
            return res.status(400).json({error: "Invalid comment ID"});

        }

        const comment = await prisma.comment.findUnique({
            where: {id: commentId}
        });

        if (!comment) {
            return res.status(404).json({error: "comment couldn't be found"});

        }
        if (comment.userId !== req.user.userId) {
            return res.status(403).json({error: "you are not authorized to delete this comment, you can only delete your own"});
        }

        await prisma.comment.delete({
            where: {id: commentId}

        });
        return res.status(200).json({message: "comment has been deleted"});
    } catch (error) {
        console.error("comment deletion error", error);
        return res.status(500).json({error: "there was a server error whilst trying to delete a comment"})
} 
};