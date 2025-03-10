import { API_CATEGORIES, API_SUB_CATEGORIES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getCategoriesByCourseID = async (course_id: number) => {
  const res = await AxiosRequest.get(`${API_CATEGORIES}/?course_id=${course_id}`)

  return res.data
}

export const getSubCategoryList = async (course_id: number, category_id: number) => {
  const res = await AxiosRequest.get(`${API_SUB_CATEGORIES}/?course_id=${course_id}&category_id=${category_id}`)

  return res.data
}
