import { API_NOTES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getFlashCards = async (queryString: {} = {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(`${API_NOTES}?${query}`)

  return res.data
}

export const updateFlashCardStatus = async (id: number, status: boolean) => {
  const url = API_NOTES + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}

export const deleteFlashCard = async (id: number) => {
  const url = API_NOTES + `/${id}`
  const res = await AxiosRequest.delete(url)

  return res
}
