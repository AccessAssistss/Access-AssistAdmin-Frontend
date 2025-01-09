export const baseUrl = "https://access-assist-admin-backend.vercel.app";

// Get Total Count
export const totalCountAPI = `${baseUrl}/api/admin/count`;

// Login API
export const loginAPI = `${baseUrl}/api/admin/login`;

// Job API
export const getJobAPI = `${baseUrl}/api/job/all`;
export const deleteJobAPI = `${baseUrl}/api/job/delete`;

// Blog API
export const createBlogAPI = `${baseUrl}/api/blog/create`;
export const updateBlogAPI = `${baseUrl}/api/blog/update`;
export const updateBlogStatusAPI = `${baseUrl}/api/blog/status`;
export const getBlogAPI = `${baseUrl}/api/blog/all`;
export const deleteBlogAPI = `${baseUrl}/api/blog`;