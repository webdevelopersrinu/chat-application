import express from "express";
import { startNewChat, userAllChats } from "../../controller/chat/ChatContoller.js";
import userAuth from "../../middleware/user.js";

const chatRoute = express.Router();

chatRoute.route("/new").post(userAuth, startNewChat)
chatRoute.route("/all-chats").get(userAuth, userAllChats)

export default chatRoute