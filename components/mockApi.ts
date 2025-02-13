import { DOCUMENT_DATA } from "./documentData"

export const fetchFormStructure = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return the DOCUMENT_DATA
  return DOCUMENT_DATA.definition
}

export const saveFormData = async (formData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate successful save
  return { success: true, message: "Form data saved successfully" }
}