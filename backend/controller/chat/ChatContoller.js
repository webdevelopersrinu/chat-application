import Chat from "../../model/Chat.js";
import asyncError from "../../utils/asyncError.js";

export const startNewChat = asyncError(async (req, res, next) => {
    const newChat = await Chat.create(req.body);
    const populatedChat = await newChat.populate("members");

    res.status(201).json({
        message: "New Chat Created Successfully",
        status: "success",
        data: populatedChat
    });
});

export const userAllChats = asyncError(async (req, res, next) => {
    const userChats = await Chat.find({ members: { $in: req.userId } })
    res.status(200).json({
        message: "Chat Featch Succesfully",
        status: "Success",
        data: userChats
    })
})