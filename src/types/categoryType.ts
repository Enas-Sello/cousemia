export type CategoryType = {
  value: number
  label: string
  parent_category: string
}

export type CourseCategoryType = {
  id: number
  title_en: string
  title_ar: string
  course_name: string
}

// Define the SubCategory type
interface SubCategory {
  value: number
  label: string
  parent_category: string
}

// Define the Category type
export interface CategoryTypeData {
  id: number
  title_en: string
  sub_categories: SubCategory[]
}

// Define the response type for getCategories
export interface CategoriesResponse {
  total: number
  categories: CategoryTypeData[]
}
