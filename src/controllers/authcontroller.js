import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

// function for user registration
export const userRegistration = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        if (!email || !username || !password)
            return res.status(400).json({ error: "Email, username and password are required to register"});

        //checks to see if user exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{email}, {username}]}});
            //if users exists, infomrs them that the details already exist
        if (existingUser) {
            return res.status(409).json({ error: "Email or username is already in use"});
        }
        //salt and hashing for password encrypting
        const salt = await bcrpyt.genSalt(10)
        const hashPassword = await bcrpyt.hash(password, salt);


        const user = await prisma.user.create ({
            data: {
                email, username, password: hashPassword
            }
        });
        
        return res.status(201).json ({ message: "User has registered successfully! Welcome",
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

} catch (error) {
    console.log("Registration error", error);
    return res.status(500).json({error: "Server error during registration process"});
}
};

    //function for user login
export const login = async(req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password)
            return res.status(400).json({error: "Email and password required to login"});

        const user = await prisma.user.findUnique({where: {email}
        })

        if (!user)
            return res.status(401).json({error: "incorrect email and/or password"});
        //compares password with submitted password
        const matchuserPassword = await bcrpyt.compare(password, user.password)

        if (!matchuserPassword)
            return res.status(401).json({error: "incorrect email and/or password"});
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "30d"}
        );

        return res.status(200).json ({
            message: "Login is successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });//error handling
} catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({error: "server issue during login phase"})
}
}
