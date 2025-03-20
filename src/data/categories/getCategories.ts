import { API_CATEGORIES_BY_CourseID, API_SUB_CATEGORIES } from '@/configs/api'

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
