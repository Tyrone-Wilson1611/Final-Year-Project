import express from "express";
import cors from "cors";
import authRoutes from ".routes/authRoutes.js";
import photoRoutes from ".routes/photoRoutes";


const app = express()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "API is now up and running"});
});

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

export default app;