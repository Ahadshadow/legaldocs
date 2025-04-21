// supportSubCategoryService.js

import { SC } from "../service/Api/serverCall";

// Create
export async function createSubCategory(payload) {
  try {
    const response = await SC.postCall({
      url: "support-sub-categories",
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating sub-category:", error);
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

// Read one
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

// Update
export async function updateSubCategory(id, payload) {
  try {
    const response = await SC.putCall({
      url: `support-sub-categories/${id}`,
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating sub-category:", error);
    throw error;
  }
}

// Delete
export async function deleteSubCategory(id) {
  try {
    const response = await SC.deleteCall({
      url: `support-sub-categories/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting sub-category:", error);
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
