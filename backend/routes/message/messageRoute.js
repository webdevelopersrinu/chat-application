import express from "express";
import userAuth from "../../middleware/user.js";
import { allMessage, newMessage } from "../../controller/chat/MessageContoller.js";

const messageRoute = express.Router();
messageRoute.route("/new").post(userAuth, newMessage)
messageRoute.route("/all/:chatId").get(userAuth, allMessage)

export default messageRoute
