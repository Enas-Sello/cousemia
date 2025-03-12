import { API_ADMIN } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getAdmin = async () => {
  const res = await AxiosRequest.get(`${API_ADMIN}`)

  return res.data
}
