export type FieldType = 
  | "text"
  | "textarea"
  | "radio"
  | "dropdown"
  | "checkbox"
  | "date"
  | "datetime"

export interface Field {
  _id: string
  type: FieldType
  label: string
  options: string[] | null
  required: boolean
  note: string | null
  position: string
  step_id: string
  updated_at: string
  created_at: string
}

export interface Step {
  _id: string
  document_id: string
  name: string
  order: number
  updated_at: string
  created_at: string
  fields: Field[]
}

export interface Document {
  _id: string
  name: string
  description: string
  documentData: string
  created_by: string
  updated_at: string
  created_at: string
  subcategory_ids: string[]
  steps: Step[]
  sub_categories: SubCategory[]
}

export interface SubCategory {
  _id: string
  category_id: string
  name: string
  updated_at: string
  created_at: string
  document_ids: string[]
}

export interface FormResponse {
  field_id: string
  value: string | string[] | boolean | Date
}

export interface FormData {
  [key: string]: string | string[] | boolean | Date
}
