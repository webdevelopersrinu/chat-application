import axiosInstance from "./index";

export const newMassage = async (massage) => {
    try {
        const response = await axiosInstance.post("/message/new", massage);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllMassges = async (id) => {
    try {
        const response = await axiosInstance.get(`/message/all/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}


