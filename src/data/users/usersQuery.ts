import { notFound } from 'next/navigation'

import { API_USERS } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch users with query parameters
export const getUsers = async (
  q: string = '',
  perPage: number = 10,
  page: number = 1,
  sortBy: string = 'id',
  sortDesc: string = 'true',
  verified: string = '',
  status: string = ''
): Promise<{ users: any[]; total: number }> => {
  const queryParams = {
    q,
    perPage,
    page,
    sortBy,
    sortDesc,
    status,
    verified
  }

  return genericQueryFn({
    url: API_USERS,
    method: 'GET',
    queryParams
  })
}

// Update user status (active/inactive)
export const updateUserStatus = async (route: string, Id: number, status: boolean): Promise<any> => {
  return genericQueryFn({
    url: `${route}/${Id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}

// Fetch a single user by ID
export const getUser = async (userId: number): Promise<any> => {
  try {
    const response = await genericQueryFn({
      url: `${API_USERS}/${userId}`,
      method: 'GET'
    })

    return response.data // Assuming genericQueryFn returns the data directly (adjust if nested under response.data)
  } catch (error) {
    notFound()
  }
}
