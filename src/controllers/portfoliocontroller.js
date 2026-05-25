import prisma from "../utils/prisma.js";

const allowedLayouts = ["layout_1", "layout_2"];
//validates to see if they layout that is placed inside the portfolio is correct
const validateInput = (layout, items) => {
    if (!allowedLayouts.includes(layout)) {
        return "invalid layout for portfolio";
    }

    if (!Array.isArray(items)) {
        return "Porfolio items must be an array";
    }

    if (items.length < 1 || items.length > 5) {
        return "portfolio must contain between 1 to 5 photos";
    }

    const positions = items.map((item) => item.position);
    const uniqueposition = new Set(positions);

    if (uniqueposition.size !== positions.length) {
        return "portfolio items must have unique positions to be added";
    }

    for (const item of items) {
        if (!Number.isInteger(item.photoId) || !Number.isInteger(item.position)) {
            return "each portfolio item needs a valid photoId and position";
        }

        if (item.position < 1 || item.position > 5) {
            return "positions must be between 1 and 5";
        }
    }
    return null;
};
    //able to access the portfolio from the username
export const getPortfolioUsername = async (req, res) => {
    try {
        const {username} = req.params;

        const user = await prisma.user.findUnique({
            where: {username},
            select: {
                id: true,
                username: true,
                portfolio: {
                    include: {
                        items: {
                            orderBy: {position: "asc"},
                            include: {
                                photo: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: "user not found"});
        }
        return res.status(200).json({username: user.username, 
            portfolio: user.portfolio});
            
        }catch(error) {
            console.error("get portfolio error:", error);
            return res.status(500).json({error: "server error whilst getting portfolio"});
        }
};
    //update portfolio by replacing existing portfolio
export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {layout, items} = req.body;

        const validationError = validateInput(layout, items);
        if (validationError) {
            return res.status(400).json({error: validationError});

        }
        const photoIds = items.map((item) => item.photoId);
        const currentPhoto = await prisma.photo.findMany({where: {
            id: {in: photoIds},
            userId
        }
    });
        if (currentPhoto.length !== photoIds.length) {
            return res.status(400).json({error: "you can only add your own photos to your portfolio"});

    }
        //transaction in prisma that deletes original portfolio and creates a new portfolio in the database
    const portfolio = await prisma.$transaction (async (tx) => {
        const currentPortfolio = await tx.portfolio.upsert({
            where: {userId},
            update: { layout },
            create: {userId, layout}
        })
        await tx.portfolioItem.deleteMany({ 
            where: {portfolioId: currentPortfolio.id}
    });

    await tx.portfolioItem.createMany({
        data: items.map((item) => ({
            portfolioId: currentPortfolio.id,
            photoId: item.photoId,
            position: item.position
        }))
    });

    return tx.portfolio.findUnique({
        where: {id: currentPortfolio.id},
        include: {
            items: {
                orderBy: {position: "asc"},
                include: {
                    photo: true
                }
            }
        }
    });
    
 });

    return res.status(200).json({message: "portfolio has updated successfully", portfolio

    });

 } catch (error) {
        console.error("error updating portfolio", error);
        return res.status(500).json({error: "server error whilst updating user portfolio"});
    } 
};
    //deletes portfolio
export const deletePortfolio = async (req, res) => {
    try {
        const userId = req.user.userId;
        const portfolio = await prisma.portfolio.findUnique({where:
            {userId}
        });
        if (!portfolio) {
            return res.status(404).json({error: "Portfolio not found"});

        }

        await prisma.portfolio.delete({
            where: {userId}
        });
        return res.status(200).json({message: "Portfolio deleted successfully"});
    } catch (error) {
        console.error("error whilst trying to delete portfolio", error);
        return res.status(500).json({error: "server error whilst trying to delete user portfolio"});
    }
    };