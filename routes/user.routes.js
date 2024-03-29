import express from "express";
import { newUser, login, getMyProfile, logOut ,searchUser} from "../Controllers/user.controller.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
const app = express.Router();
app.post("/new", singleAvatar, newUser);
app.post("/login", login);

// Affter here user must be logged in to access the routes
app.use(isAuthenticated)
app.get("/me", getMyProfile)
app.get("/logout", logOut)
app.get("/search",searchUser)
export default app;
