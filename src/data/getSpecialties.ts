import { API_SPECIALTIES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getSpecialties = async (queryString: {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(`${API_SPECIALTIES}?${query}`)

  return res.data
}

export const statusUpdateSpecialties = async (id: number, status: boolean) => {
  const url = API_SPECIALTIES + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}
