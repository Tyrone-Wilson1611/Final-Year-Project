import prisma from "../utils/prisma.js";

export const getUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await prisma.user.findUnique({where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                        _count: {
                            select: {
                                followers: true,
                                following: true,
                                photos: {
                                    where: {
                                        type: "post"
                                    }
                                }
                            }
                        },

                        photos: {
                            where: {
                                type: "post"
                            },
                            orderBy: {
                                createdAt: "desc"
                            },
                            include: {
                                _count: {
                                    select: {comments: true,
                                        likes: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        
        return res.status(200).json({user});
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({error: "server error whilst getting user info"});
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({where: {id: userId},
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                photos: {
                    where : {
                        type: "post"
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({error: "user not found"});
        }
        return res.status(200).json({user});
    } catch (error) {
        console.error("get profile error", error);
        res.status(500).json({error: "server error whilst getting profile information"})
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {username, bio, avatarUrl} = req.body;

        const existingUser = await prisma.user.update({
            where: {id: userId},
            data: {username, bio, avatarUrl},
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true
            }
        });

        return res.status(200).json({message: "Profile has been updated successfully", user: existingUser});
    } catch(error) {
        console.error("Issue arose whilst updating profile", error);
        res.status(500).json({error: "server error whilst trying to update profile"});
    }
}