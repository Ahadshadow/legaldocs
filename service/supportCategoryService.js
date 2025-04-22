import { SC } from "./Api/serverCall";

export async function createCategory(payload) {
  try {
    const response = await SC.postCall({
      url: "support-categories",
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function getCategories(page) {
  try {
    const response = await SC.getCall({
      url: "support-categories",
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategory(slug) {
  try {
    const response = await SC.getCall({ url: `support-categories/${slug}` });
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export async function updateCategory(id, payload) {
  try {
    const response = await SC.putCall({
      url: `support-categories/${id}`,
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const response = await SC.deleteCall({
      url: `support-categories/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}
