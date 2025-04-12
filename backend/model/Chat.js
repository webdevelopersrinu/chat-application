import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members: {
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        ],
        required: [true, "Select Chat Member requird!"],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "Select Chat Member",
        },
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "message"
    },
    unreadMessageCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model("chat", chatSchema);
export default Chat