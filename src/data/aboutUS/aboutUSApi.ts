import { API_ABOUT_US } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'


// Type for the API response
export type AboutUsResponse = {
  data: {
    content: string
  }
  message: string
  status_code: number
}

// Type for the update payload
export type UpdateAboutUsData = {
  content: string
}

// Fetch the "About Us" content
export const fetchAboutUsContent = async (): Promise<AboutUsResponse> => {
  return genericQueryFn({
    url: API_ABOUT_US,
    method: 'GET'
  })
}

// Update the "About Us" content
export const updateAboutUsContent = async (data: UpdateAboutUsData): Promise<AboutUsResponse> => {
  return genericQueryFn({
    url: API_ABOUT_US,
    method: 'PUT',
    body: data
  })
}
