import { API_COURSE_CATEGORIES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch subcategories for a given category ID with optional query parameters
export const getSubCategories = async (id: number, queryString: Record<string, any> = {}) => {
  return genericQueryFn({
    url: `${API_COURSE_CATEGORIES}/${id}`,
    method: 'GET',
    queryParams: queryString
  })
}

// Delete a subcategory by ID
export const deleteSubCategory = async (id: number) => {
  return genericQueryFn({
    url: `${API_COURSE_CATEGORIES}/${id}`,
    method: 'DELETE'
  })
}
