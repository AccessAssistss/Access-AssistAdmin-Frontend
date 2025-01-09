import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../ReduxToolkit/Slice/Signin";
import jobSlice from "../ReduxToolkit/Slice/Job";
import blogSlice from "../ReduxToolkit/Slice/Blog";

const rootReducer = combineReducers({
  signIn: authSlice,
  job: jobSlice,
  blog: blogSlice,
});

export default rootReducer;
