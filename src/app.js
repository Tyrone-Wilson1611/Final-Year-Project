import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "API is now up and running"});
});

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({error: err.message || "something has gone wrong"});
    }
    next();

});

export default app;