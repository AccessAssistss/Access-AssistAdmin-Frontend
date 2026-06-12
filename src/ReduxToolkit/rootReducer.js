import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../ReduxToolkit/Slice/Signin";
import jobSlice from "../ReduxToolkit/Slice/Job";
import blogSlice from "../ReduxToolkit/Slice/Blog";
import projectsSlice from "../ReduxToolkit/Slice/Projects";

const rootReducer = combineReducers({
  signIn: authSlice,
  job: jobSlice,
  blog: blogSlice,
  projects: projectsSlice,
});

export default rootReducer;
