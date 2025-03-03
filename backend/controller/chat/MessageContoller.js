import Chat from "../../model/Chat.js";
import Message from "../../model/Message.js";
import asyncError from "../../utils/asyncError.js";

export const newMessage = asyncError(async (req, res, next) => {
    const message = await Message.create(req.body)
    const cureentChat = await Chat.findByIdAndUpdate({ _id: req.body.chatId }, { lastMessage: message._id, $inc: { unreadMessageCount: 1 } })
    res.status(201).json({
        message: "New Message Created Successfully",
        status: "success",
        data: message
    })
})

export const allMessage = asyncError(async (req, res, next) => {
    const allMessages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.send({
        message: 'Messages fetched successfully',
        success: "success",
        data: allMessages
    })
})