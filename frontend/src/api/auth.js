import axiosInstance from "./index.js"
export const handleLogin = async (formData) => {
    const { email, password } = formData
    try {
        const response = await axiosInstance.post('/user/login', {
            email,
            password,
        });
        localStorage.setItem('chatAppToken', response.data.token);
        return response.data
    } catch (error) {
        // return error.response.data
        throw error
    }
};

export const handleSingup = async (formData) => {
    const { lastname, firstname, email, password } = formData
    console.log(formData)
    try {
        const response = await axiosInstance.post("/user/singup", {
            lastname,
            firstname,
            email,
            password
        })
        localStorage.setItem('chatAppToken', response.data.token);
        return response.data
    } catch (error) {
        // return error.response.data
        throw error
    }
}


