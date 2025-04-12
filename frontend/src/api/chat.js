import axiosInstance from "./index";

export const startChat = async (members) => {
    try {
        const response = await axiosInstance.post("/chat/new", { members });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get("/chat/all-chats");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


export const clearUnreadMessage = async (chatId) => {
    try {
        const response = await axiosInstance.put("/chat/clear-unread-message", { chatId });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

