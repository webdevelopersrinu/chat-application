import Chat from "../../model/Chat.js";
import Message from "../../model/Message.js";
import asyncError from "../../utils/asyncError.js";

export const startNewChat = asyncError(async (req, res, next) => {
    const newChat = await Chat.create(req.body);
    const populatedChat = await newChat;

    res.status(201).json({
        message: "New Chat Created Successfully",
        status: true,
        data: populatedChat
    });
});

export const userAllChats = asyncError(async (req, res, next) => {
    const userChats = await Chat.find({ members: { $in: req.userId } }).populate("lastMessage")
    res.status(200).json({
        message: "Chat Featch Succesfully",
        status: true,
        data: userChats
    })
})

export const clearUnreadMessage = asyncError(async (req, res, next) => {
    const chatId = req.body.chatId;
    const chat = await Chat.findById(chatId)
    if (!chat) {
        let err = new CustomError("No Chat Found", 404);
        return next(err);
    }
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { unreadMessageCount: 0 }, { new: true }).populate("lastMessage")
    await Message.updateMany({ chatId, read: false }, { read: true })
    res.send({
        message: "Unread message cleared succeesfully",
        status: true,
        data: updatedChat
    })
})