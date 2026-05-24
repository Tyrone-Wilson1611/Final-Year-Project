import prisma from "../utils/prisma.js";

export const followUser = async (req, res) => {
    try {
        const followerId = req.user.userId;
        const followingId = Number(req.params.userId);

        if (Number.isNaN(followingId)) {
            return res.status(400).json({error: "invalid user ID "});

        }

        if (followerId === followingId) {
            return res.status(400).json({error: "users cannot follow themselves"});
        }

        const userToFollow = await prisma.user.findUnique({where: 
            {id: followingId}});

        if (!userToFollow) {
            return res.status(404).json({error: "user you want to follow cannnot be found"});
        }

        await prisma.follow.upsert({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }, update: {}, create: {
                followerId,
                followingId
            }
        });

        return res.status(201).json({message: "user followed successfully"});
    } catch (error) {
        console.error("follow user error", error);
        return res.status(500).json({error: "server error whilst trying to follow user"});
    }

};

export const unfollow = async (req, res) => {
    try {
        const followerId = req.user.userId;
        const followingId = Number(req.params.userId);

        if (Number.isNaN(followingId)) {
            return res.status(400).json({error: "Invalid user id"});
        }

        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        return res.status(200).json({message: "user unfollowed"});
    } catch (error) {
        console.error("unfollow user error", error);
        return res.status(500).json({error: "server error whilst unfollowing user"});
    }
}