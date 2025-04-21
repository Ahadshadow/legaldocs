import { SC } from "./Api/serverCall";

export async function getCategories() {
  try {
    const response = await SC.getCall({ url: "support-categories" });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Read all
export async function getSubCategories() {
  try {
    const response = await SC.getCall({ url: "support-sub-categories" });
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    throw error;
  }
}

// Get sub-categories by category slug
export async function getSubCategoriesByCategory(slug) {
  try {
    const response = await SC.getCall({
      url: `support-sub-categories/by-category/${slug}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-categories by category:", error);
    throw error;
  }
}
export async function getSubCategory(slug) {
  try {
    const response = await SC.getCall({
      url: `support-sub-categories/${slug}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-category:", error);
    throw error;
  }
}

export async function getPopularBlogs() {
  try {
    const response = await SC.getCall({ url: "support-blogs-popular" });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

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

export async function searchBlogs(query) {
  try {
    const response = await SC.getCall({
      url: `support-blogs/search`,
      params: {
        query: query || "",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}
