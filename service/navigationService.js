import { SC } from "../service/Api/serverCall"

export async function getCategories() {
  try {
    const response = await SC.getCall({ url: "document/678acd9fac31dcfb630e508c" })
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

