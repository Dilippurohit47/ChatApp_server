import express  from "express";
import { newUser ,login} from "../Controllers/user.controller.js";
import {  singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new",singleAvatar,newUser)
app.post("/login",login)



export default app