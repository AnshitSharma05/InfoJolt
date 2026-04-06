import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        userProfile:null,
        sessionChecked:false,
    },
    reducers:{
        //actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setUserProfile:(state, action) => {
            state.userProfile = action.payload;
        },
        setSessionChecked:(state, action) => {
            state.sessionChecked = action.payload;
        },
    }
});
export const {setLoading, setUser, setUserProfile, setSessionChecked} = authSlice.actions;
export default authSlice.reducer;