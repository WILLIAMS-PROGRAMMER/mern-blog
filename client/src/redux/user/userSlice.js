import { createSlice } from '@reduxjs/toolkit' // this is for creating a slice of the store , this meeans  that
// we can have multiple slices of the store and each slice can have its own reducer and actions

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: { // these are the actions that we can dispatch to the store
       signInStart: (state) => {
           state.loading = true;
           state.error = null;
       },
       SignInSuccess: (state, action) => {
            state.currentUser = action.payload; // this is the user object that we get from the server
            state.loading = false;
            state.error = null;
       },
       SignInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
       },
       updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //deleteUser
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => { 
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //signout
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const { signInStart, SignInSuccess, SignInFailure, updateStart, updateSuccess, updateFailure, deleteStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } = userSlice.actions;

export default userSlice.reducer;