import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAllProjectsAPI,
  createProjectAPI,
  updateProjectAPI,
  updateProjectStatusAPI,
} from "../../ApiUrls";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};


export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(getAllProjectsAPI, getAuthHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(createProjectAPI, formData, {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${updateProjectAPI}/${id}`, formData, {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// AFTER
export const updateProjectStatus = createAsyncThunk(
  "projects/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {  
    try {
      const res = await axios.patch(
        `${updateProjectStatusAPI}/${id}`,
        { status },            
        getAuthHeaders()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Status update failed");
    }
  }
);


const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    totalProjects: 0,
    projectsThisMonth: 0,
    projectsToday: 0,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects || [];
        state.totalProjects = action.payload.totalProjects || 0;
        state.projectsThisMonth = action.payload.projectsThisMonth || 0;
        state.projectsToday = action.payload.projectsToday || 0;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createProject.pending, (state) => { state.actionLoading = true; })
      .addCase(createProject.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProject.pending, (state) => { state.actionLoading = true; })
      .addCase(updateProject.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProjectStatus.pending, (state) => { state.actionLoading = true; })
      .addCase(updateProjectStatus.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;