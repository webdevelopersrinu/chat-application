import axiosInstance from "./index.js"

export const getLoggedUserData = async () => {
    try {
        const response = await axiosInstance.get("/user/info");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/user/all")
        return response.data
    } catch (err) {
        return err.response.data
    }
}