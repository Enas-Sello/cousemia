import { API_COURSE_CATEGORIES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getSubCategories = async (id: number, queryString: {} = {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(API_COURSE_CATEGORIES + `/${id}?${query}`)

  return res.data
}

export const deleteSubCategory = async (id: number) => {
  const url = API_COURSE_CATEGORIES + `/${id}`
  const res = await AxiosRequest.delete(url)

  return res
}
