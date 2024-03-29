import express from "express";
import { connectDb } from "./utils/features.js";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.route.js";
import { createdUser } from "./seeders/user.js";

dotenv.config();
const mongoUri = process.env.MONGO_URI;

connectDb(mongoUri);
// createdUser(10)  
const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(morgan("dev"));
app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


const PORT = process.env.PORT || 3000;
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
