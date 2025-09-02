import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  credentials: null, // stores Key and range
  loading: false,
  error: null,
};

const googleSlice = createSlice({
  name: "google",
  initialState,
  reducers: {
    setGoogleCredentials(state, action) {
      state.credentials = action.payload;
    },
    setGoogleLoading(state, action) {
      state.loading = action.payload;
    },
    setGoogleError(state, action) {
      state.error = action.payload;
    },
        clearGoogleCredentials(state) {
      state.credentials = null; // clear credentials on disconnect
    },

  },
});

export const { setGoogleCredentials, setGoogleLoading, setGoogleError,clearGoogleCredentials } = googleSlice.actions;

export default googleSlice.reducer;