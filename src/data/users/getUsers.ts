import { notFound } from 'next/navigation'

import { API_USERS } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

const getUsers = async (
  q: string = '',
  perPage: number = 10,
  page: number = 1,
  sortBy: string = 'id',
  sortDesc: string = 'true',
  verified: string,
  status: string
) => {
  const query = `?q=${q}&perPage=${perPage}&page=${page}&sortBy=${sortBy}&sortDesc=${sortDesc}&status=${status}&verified=${verified}`
  const url = `${API_USERS}${query}`
  const res = await AxiosRequest.get(url)

  return res.data // Assume response contains { users: UserType[], total: number }
}

export default getUsers

export const updateUserStatus = async (route: string, Id: number, status: boolean) => {
  const url = route + `/${Id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res.data
}

export const getUser = async (userId: number) => {
  try {
    const res = await AxiosRequest.get(API_USERS + `/${userId}`)

    return res.data.data
  } catch (error) {
    notFound()
  }
}
