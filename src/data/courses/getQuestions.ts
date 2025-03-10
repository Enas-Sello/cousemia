import { API_QUESTIONS } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getQuestions = async (queryString: {} = {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(`${API_QUESTIONS}?${query}`)

  return res.data
}

export const updateQuestionStatus = async (id: number, status: boolean) => {
  const url = API_QUESTIONS + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}

export const deleteQuestion = async (id: number) => {
  const url = API_QUESTIONS + `/${id}`
  const res = await AxiosRequest.delete(url)

  return res
}
