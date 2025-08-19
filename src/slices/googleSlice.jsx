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
  },
});

export const { setGoogleCredentials, setGoogleLoading, setGoogleError } = googleSlice.actions;

export default googleSlice.reducer;