import express, { urlencoded } from "express";
import userRoute from "./routes/user.routes.js";
import { connectDb } from "./utils/features.js";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const mongoUri = process.env.MONGO_URI;

connectDb(mongoUri);

const app = express();
app.use(express.json());

app.use(morgan("dev"));
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
