import { configureStore } from "@reduxjs/toolkit"
import loaderReducer from "./loader.js"
import userReducer from "./user.js"

const store = configureStore({
    reducer: {
        loader: loaderReducer,
        user: userReducer,
    }
});

export default store;