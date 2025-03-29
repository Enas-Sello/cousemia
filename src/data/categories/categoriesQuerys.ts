import {
  API_CATEGORIES_BY_CourseID,
  API_SUB_CATEGORIES,
  API_CATEGORIES,

  // API_COURSE_CATEGORIES,
  API_LIST_CATEGORIES
} from '@/configs/api'

// import AxiosRequest from '@/libs/axios.config'
import { genericQueryFn } from '@/libs/queryFn'
import type { CategoryType } from '@/types/categoryType'

// Fetch categories by course ID
export const getCategoriesByCourseID = async (courseId: number): Promise<{ data: CategoryType[] }> => {
  return genericQueryFn({
    url: `${API_CATEGORIES_BY_CourseID}/?course_id=${courseId}`,
    method: 'GET'
  })
}

// Fetch subcategories by course and category ID
export const getSubCategoryList = async (courseId: number, categoryId: number): Promise<{ data: any }> => {
  return genericQueryFn({
    url: `${API_SUB_CATEGORIES}/?course_id=${courseId}&category_id=${categoryId}`,
    method: 'GET'
  })
}

// Fetch categories with optional query parameters
export const getCategories = async (queryString: Record<string, any> = {}) => {
  return genericQueryFn({
    url: API_LIST_CATEGORIES,
    method: 'GET',
    queryParams: queryString
  })
}

export const getCategoryById = async (id: number) => {
  return genericQueryFn({
    url: `${API_CATEGORIES}/${id}`,
    method: 'GET'
  })
}

// Update category status (active/inactive)
export const updateCategory = async (id: number, data: any) => {
  return genericQueryFn({
    url: `${API_CATEGORIES}/${id}`,
    method: 'PUT',
    body: data
  })
}

// Delete a category by ID
export const deleteCategory = async (id: number): Promise<void> => {
  return genericQueryFn({
    url: `${API_CATEGORIES}/${id}`,
    method: 'DELETE'
  })
}
