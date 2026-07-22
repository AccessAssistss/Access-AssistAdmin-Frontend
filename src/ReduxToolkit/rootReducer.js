import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../ReduxToolkit/Slice/Signin";
import jobSlice from "../ReduxToolkit/Slice/Job";
import blogSlice from "../ReduxToolkit/Slice/Blog";
import projectsSlice from "../ReduxToolkit/Slice/Projects";
import jobPostSlice from "./Slice/jobPostSlice";

const rootReducer = combineReducers({
  signIn: authSlice,
  job: jobSlice,
  blog: blogSlice,
  projects: projectsSlice,
  jobPost: jobPostSlice,
});

export default rootReducer;
