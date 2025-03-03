import mongoose from "mongoose";
const messageScema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Chat",
        required: [true, "Chat id is required"],
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: [true, "Sender id is required"],
    },
    text: {
        type: String,
        required: [true, "Message text is required"],
    },
    image: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.models.Chat || mongoose.model("message", messageScema);
export default Message