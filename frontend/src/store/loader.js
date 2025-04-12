import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: 'loader',
    initialState: { isLoader: false },
    reducers: {
        showLoader: (state) => { state.isLoader = true },
        hideLoader: (state) => { state.isLoader = false }
    }
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;