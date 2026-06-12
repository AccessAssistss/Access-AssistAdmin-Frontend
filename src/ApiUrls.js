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

// Project API
export const createProjectAPI = `${baseUrl}/api/project/createProject`;
export const updateProjectAPI = `${baseUrl}/api/project/updateProject`;
export const updateProjectStatusAPI = `${baseUrl}/api/project/updateProjectStatus`;
export const getAllProjectsAPI = `${baseUrl}/api/project/getAllProjects`;
