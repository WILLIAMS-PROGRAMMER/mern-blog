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
    reducers: {
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
    },
});

export const { signInStart, SignInSuccess, SignInFailure } = userSlice.actions;

export default userSlice.reducer;