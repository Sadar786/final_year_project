import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myShop: null,
    error: null,
    loading: false,
    signInSatus: false
};

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        signInDone: (state)=>{
            state.signInSatus = true
        },
        signOutDone : (state)=>{
            state.signInSatus = false
        },
        shopIsCreating: (state) => {
            state.loading = true;
            state.error = null;
        },
        shopIsCreated: (state, action) => {
            state.loading = false;
            state.error = null;
            state.myShop = action.payload;
        },
        shopIsNotCreated: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateShopStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateShopSuccess: (state, action) => {
            state.myShop = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateShopFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteShopStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteShopSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.myShop = null;
        },
        deleteShopFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    signInDone,
    signOutDone,
    shopIsCreated,
    shopIsCreating,
    shopIsNotCreated,
    deleteShopFailure,
    deleteShopStart,
    deleteShopSuccess,
    updateShopStart,
    updateShopSuccess,
    updateShopFailure,
} = shopSlice.actions;

export default shopSlice.reducer;
