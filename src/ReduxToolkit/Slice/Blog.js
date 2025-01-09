import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createBlogAPI,
  deleteBlogAPI,
  getBlogAPI,
  updateBlogAPI,
  updateBlogStatusAPI,
} from "../../ApiUrls";
import { toast } from "react-toastify";

// Create Blog
export const createBlog = createAsyncThunk(
  "createBlog/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${createBlogAPI}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Update Blog
export const updateBlog = createAsyncThunk(
  "updateBlog/update",
  async ({ blogId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${updateBlogAPI}/${blogId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Update Blog Status
export const updateStatus = createAsyncThunk(
  "updateStatus/status",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${updateBlogStatusAPI}/${data.blogId}`,
        {
          status: data.updatedStatus,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Get Blogs
export const getBlog = createAsyncThunk("getBlog/get", async () => {
  try {
    const response = await axios.get(getBlogAPI);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Delete Blogs
export const deleteBlog = createAsyncThunk(
  "deleteBlog/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${deleteBlogAPI}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Create Blog
      .addCase(createBlog.pending, (state) => {
        state.status = "uploading";
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newBlog = action.payload.blog;
        state.blogs.push(newBlog);
        toast.success("Blog created successfully!");
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error("Failed to create blog.");
      })
      // Handle Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.status = "uploading";
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedBlog = action.payload.blog;

        const index = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );

        if (index !== -1) {
          state.blogs[index] = updatedBlog;
          toast.success("Blog updated successfully!");
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error("Failed to update blog.");
      })

      // Handle updating status
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedBlog = action.payload.blog;
        const existingBlog = state.blogs.find(
          (blog) => blog._id === updatedBlog._id
        );
        if (existingBlog) {
          existingBlog.status = updatedBlog.status;
        }
        toast.success("Status updated successfully!");
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetching blogs
      .addCase(getBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload.blogs;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle deleting blogs
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        toast.success("Blog deleted successfully!");
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
