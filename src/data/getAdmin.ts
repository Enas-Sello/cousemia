import { API_ADMIN } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch admin data
export const getAdmin = async (): Promise<any> => {
  return genericQueryFn({
    url: API_ADMIN,
    method: 'GET'
  })
}
