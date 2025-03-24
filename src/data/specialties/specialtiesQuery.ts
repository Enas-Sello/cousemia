import { API_SPECIALTIES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch specialties with optional query parameters
export const getSpecialties = async (queryString: Record<string, any> = {}): Promise<any> => {
  return genericQueryFn({
    url: API_SPECIALTIES,
    method: 'GET',
    queryParams: queryString
  })
}

// Update specialty status (active/inactive)
export const statusUpdateSpecialties = async (id: number, status: boolean): Promise<any> => {
  return genericQueryFn({
    url: `${API_SPECIALTIES}/${id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}
