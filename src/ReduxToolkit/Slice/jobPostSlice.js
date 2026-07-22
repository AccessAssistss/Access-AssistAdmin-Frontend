import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createJobPostAPI,
  updateJobPostAPI,
  getAllJobPostsAPI,
  updateJobPostStatusAPI,
  deleteJobPostAPI,
} from "../../ApiUrls";

// Get JobPosts
export const getJobPosts = createAsyncThunk(
  "jobPost/getJobPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(getAllJobPostsAPI);
      return res.data?.data || res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create JobPost
export const createJobPost = createAsyncThunk(
  "jobPost/createJobPost",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(createJobPostAPI, payload);
      return res.data?.data || res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update JobPost
export const updateJobPost = createAsyncThunk(
  "jobPost/updateJobPost",
  async ({ jobPostId, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.put(updateJobPostAPI(jobPostId), payload);
      return res.data?.data || res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateJobPostStatus = createAsyncThunk(
  "jobPost/updateJobPostStatus",
  async ({ jobPostId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(updateJobPostStatusAPI(jobPostId), {
        status,
      });
      return { jobPostId, status, data: res.data?.data || res.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete JobPost
export const deleteJobPost = createAsyncThunk(
  "jobPost/deleteJobPost",
  async (jobPostId, { rejectWithValue }) => {
    try {
      await axios.delete(deleteJobPostAPI(jobPostId));
      return jobPostId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const jobPostSlice = createSlice({
  name: "jobPost",
  initialState: {
    jobPosts: [],
    status: "idle",
    error: null,
    actionStatus: "idle",
  },
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobPosts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getJobPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createJobPost.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (action.payload) state.jobPosts.unshift(action.payload);
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      .addCase(updateJobPost.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id) {
          const idx = state.jobPosts.findIndex((j) => j._id === updated._id);
          if (idx !== -1) state.jobPosts[idx] = updated;
        }
      })
      .addCase(updateJobPost.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Toggle status — optimistic-ish update, no full-page reload needed
      .addCase(updateJobPostStatus.fulfilled, (state, action) => {
        const { jobPostId, status } = action.payload;
        const idx = state.jobPosts.findIndex((j) => j._id === jobPostId);
        if (idx !== -1) state.jobPosts[idx].status = status;
      })
      .addCase(updateJobPostStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.jobPosts = state.jobPosts.filter(
          (j) => j._id !== action.payload
        );
      })
      .addCase(deleteJobPost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetActionStatus } = jobPostSlice.actions;
export default jobPostSlice.reducer;