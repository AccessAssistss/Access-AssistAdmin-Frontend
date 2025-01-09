import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteJobAPI, getJobAPI } from "../../ApiUrls";
import { toast } from "react-toastify";

// Get Jobs
export const getJob = createAsyncThunk("getJob/get", async () => {
  try {
    const response = await axios.get(getJobAPI);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Delete Jobs
export const deleteJob = createAsyncThunk(
  "deleteJob/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${deleteJobAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching jobs
      .addCase(getJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload.jobs;
      })
      .addCase(getJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle deleting jobs
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = state.jobs.filter(
          (job) => job._id !== action.payload
        );
        toast.success("Job deleted successfully!");
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
