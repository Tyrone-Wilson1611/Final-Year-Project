import jwt from "jsonwebtoken";
//authentication for users using JWT
function authMiddleware(req, res, next) {
    
    const protect = req.headers.authorization;

    if (!protect || !protect.startsWith("Bearer ")) {
        return res.status(401).json({error: "No token has been provided"});

    }

    const token = protect.split(" ")[1];
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error("Auth middleware error", error)
        return res.status(401).json({ error: "token that was given is invalid"})
    }
}


export default authMiddleware;