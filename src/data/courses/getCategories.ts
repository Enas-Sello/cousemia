import { API_COURSE_CATEGORIES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getCategories = async (id: number, queryString: {} = {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(API_COURSE_CATEGORIES + `/${id}?${query}`)

  return res.data
}

export const updateCategoryStatus = async (id: number, status: boolean) => {
  const url = API_COURSE_CATEGORIES + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}

export const deleteCategory = async (id: number) => {
  const url = API_COURSE_CATEGORIES + `/${id}`
  const res = await AxiosRequest.delete(url)

  return res
}
