import jwt from "jsonwebtoken";


function authMiddleware(req, res, next) {
    const protect = req.headers.authorization;

    const token = protect.split("")[1];

    if (!protect || !protect.startsWith("Bearer")) {
        return res.status(401).json({error: "No token has been provided"});

    }
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