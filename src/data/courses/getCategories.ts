import { API_CATEGORIES, API_COURSE_CATEGORIES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'
import { genericQueryFn } from '@/libs/queryFn'

export const getCategories = async (queryString: Record<string, any> = {}) => {
      console.log('filterQuery', queryString)

  return genericQueryFn({
    url: API_CATEGORIES,
    method: 'GET',
    queryParams: queryString
  })
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
