import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers } from "../Controllers/chat.controller.js";

const app = express.Router();

app.use(isAuthenticated)
app.post("/new",newGroupChat)
app.get("/my",getMyChats)
app.get("/my/groups",getMyGroups)
app.put("/addmembers",addMembers)
app.put("/removemember",removeMembers)
app.delete("/leave/:id", leaveGroup);


export default app
