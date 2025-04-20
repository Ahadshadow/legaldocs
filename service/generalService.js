import { SC } from "../service/Api/serverCall";

export async function searchDocuments(keyword, searchBy) {
  try {
    const response = await SC.getCall({
      url: `search`,
      params: {
        q: keyword,
        search_document: searchBy?.search_document || false,
        search_subcategory: searchBy?.search_subcategory || false,
        search_category: searchBy?.search_category || false,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
}
