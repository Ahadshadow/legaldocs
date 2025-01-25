import { SC } from "../service/Api/serverCall"

export async function getCategories() {
  try {
    const response = await SC.getCall({ url: "categoryList" })
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function getSubcategoriesByCategoryId(categoryId) {
  try {
    const response = await SC.getCall({ url: `subCategoryList?categoryId=${categoryId}` })
    return response.data
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    throw error
  }
}

