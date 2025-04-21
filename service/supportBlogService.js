// supportBlogService.js

import { SC } from "../service/Api/serverCall";

// Create
export async function createBlog(payload) {
  try {
    const response = await SC.postCall({
      url: "support-blogs",
      data: payload,
      formData: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

// Read all
export async function getBlogs() {
  try {
    const response = await SC.getCall({ url: "support-blogs" });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

// Read one
export async function getBlog(slug) {
  try {
    const response = await SC.getCall({
      url: `support-blogs/${slug}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

// Update
export async function updateBlog(id, payload) {
  try {
    const response = await SC.postCall({
      url: `support-blogs/${id}`,
      data: payload,
      formData: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

// Delete
export async function deleteBlog(id) {
  try {
    const response = await SC.deleteCall({
      url: `support-blogs/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

// Get blogs by sub-category slug
export async function getBlogsBySubCategory(slug) {
  try {
    const response = await SC.getCall({
      url: `support-blogs/by-sub-category/${slug}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by sub-category:", error);
    throw error;
  }
}
