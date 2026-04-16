import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json);


app.listen(PORT, () => console.log('Server running on port 5000'))