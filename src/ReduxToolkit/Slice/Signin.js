import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginAPI, totalCountAPI } from "../../ApiUrls";

const token = sessionStorage.getItem("token");
const headers = token ? { Authorization: `Bearer ${token}` } : {};

// Fetch total count
export const totalcount = createAsyncThunk(
  "totalcount/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(totalCountAPI, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign in
export const SignInAPi = createAsyncThunk(
  "signIn/SignInAPi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(loginAPI, data);
      sessionStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "signIn",
  initialState: {
    profile: null,
    totalCount: null,
    status: "idle",
    error: null,
    message: null,
    accessToken: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(totalcount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(totalcount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalCount = action.payload;
      })
      .addCase(totalcount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(SignInAPi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SignInAPi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(SignInAPi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
