const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {

  SEARCH_API: BASE_URL + "/search",
  NOTIFICATION_API: BASE_URL + "/alerts",
  FEEDBACK_API: BASE_URL + "/feedback",

  SENDOTP_API: BASE_URL + "/auth/sendotp",
  REGISTER_API: BASE_URL + "/auth/register",
  SIGNUP_API: BASE_URL + "/auth/signup",
  
  SIGNIN_API: BASE_URL + "/auth/signin",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",

  UPDATE_IMAGE_API: BASE_URL + "/auth/update-image",
  UPDATE_INFO_API: BASE_URL + "/auth/update-info",

  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",

  SEND_EMAIL_OTP_API: BASE_URL + "/auth/sendotp-email",
  VERIFY_EMAIL_OTP_API: BASE_URL + "/auth/verifyotp-email",

  GET_USER_DETAILS_API: BASE_URL + "/auth/get-user-details",
  GET_ALL_USERS_API: BASE_URL + "/auth/get-all-user-details", 
  EDIT_USER_API: (userId) => `${BASE_URL}/auth/edit-user/${userId}`, 
  DELETE_USER_API: (userId) => `${BASE_URL}/auth/delete-user/${userId}`,
};

//JIRA ENDPOINTS
export const jiraendpoints = {
  GET_ISSUES_API: BASE_URL + "/jira/issues",
  GET_ISSUES_BY_ID_API: BASE_URL + "/jira/issues",
  JIRA_CONNECT_API: BASE_URL + "/jira/connect",
  GET_JIRA_CREDENTIALS_API: BASE_URL + "/jira/credentials",
}

//Google ENDPOINTS
export const googleendpoints = {
  GET_ALL_GOOGLE_DETAILS_API: BASE_URL + "/google",
  GET_GOOGLE_SHEET_BY_ID_API: BASE_URL + "/google",
  // GET_ISSUES_BY_ID_API: BASE_URL + "/jira/issues",
  // JIRA_CONNECT_API: BASE_URL + "/jira/connect",
  GET_GOOGLE_CREDENTIALS_API: BASE_URL + "/google/credentials",
}
