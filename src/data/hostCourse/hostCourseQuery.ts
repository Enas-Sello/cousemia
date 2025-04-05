import { API_HOSTCOURSE } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch all countries
export const getHostCourseRequests = async (queryString: Record<string, any> = {}): Promise<HostCourseRequestsResponse> => {
  return genericQueryFn({
    url: API_HOSTCOURSE,
    method: 'GET',
    queryParams: queryString
  })
}

// Type for a single host course request
export type HostCourseRequest = {
  id: number
  name: string
  mobile: string
  email: string
  about_course: string
  country_id: number
  speciality_id: number
  country: string
  speciality: string
}

// Type for the API response containing a list of host course requests
export type HostCourseRequestsResponse = {
  total: number
  hostCourseRequests: HostCourseRequest[]
}
