import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  credentials: null, // stores jiraEmail, jiraSite, jiraApiKey
  loading: false,
  error: null,
};

const jiraDetailSlice = createSlice({
  name: "jira",
  initialState,
  reducers: {
    setJiraCredentials(state, action) {
      state.credentials = action.payload;
    },
    setJiraLoading(state, action) {
      state.loading = action.payload;
    },
    setJiraError(state, action) {
      state.error = action.payload;
    },
        selectJiraProject(state, action) {
      state.credentials = action.payload;
    },
        selectJiraStatus(state, action) {
      state.credentials = action.payload;
    },
        selectJiraError(state, action) {
      state.credentials = action.payload;
    },
        clearJiraCredentials(state) {
      state.credentials = null; // clear credentials on disconnect
    },
  },
});

export const { setJiraCredentials,fetchProjectBySlug,selectJiraProject, setJiraLoading,selectJiraError,selectJiraStatus, setJiraError,clearJiraCredentials } = jiraDetailSlice.actions;

export default jiraDetailSlice.reducer;