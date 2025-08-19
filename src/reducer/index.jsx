import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import jiraDetailReducer from "../slices/jiraDetailSlice";
import googleReducer from "../slices/googleSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
    jiradetail: jiraDetailReducer,
  google: googleReducer,

})

export default rootReducer
