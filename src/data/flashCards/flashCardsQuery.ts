import { API_URL, API_FLASH_CARDS, API_COURSES_LECTURES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch flash cards with optional query parameters
export const getFlashCards = async (queryString: Record<string, any> = {}): Promise<any> => {
  return genericQueryFn({
    url: API_FLASH_CARDS,
    method: 'GET',
    queryParams: queryString
  })
}

// Update flash card status (active/inactive)
export const updateFlashCardStatus = async (id: number, status: boolean): Promise<any> => {
  return genericQueryFn({
    url: `${API_FLASH_CARDS}/${id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}

// Delete a flash card by ID
export const deleteFlashCard = async (id: number): Promise<any> => {
  return genericQueryFn({
    url: `${API_FLASH_CARDS}/${id}`,
    method: 'DELETE'
  })
}

// Upload a video for a flash card
export const uploadFlashCardVideo = async (data: FormData): Promise<any> => {
  return genericQueryFn({
    url: `${API_FLASH_CARDS}/upload-video`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Required for FormData uploads
    }
  })
}

// Upload an image for a flash card
export const uploadFlashCardImage = async (data: FormData): Promise<any> => {
  return genericQueryFn({
    url: `${API_URL}/media`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Corrected from 'image/png' to 'multipart/form-data'
    }
  })
}

// Create a new flash card
export const createFlashCard = async (data: Record<string, any>): Promise<void> => {
  return genericQueryFn({
    url: API_FLASH_CARDS,
    method: 'POST',
    body: data
  })
}

// Store a new flash card
export const storeFlashCard = async (data: {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  is_free_content: string
  video_thumb: string
  course_id: number
  category_id: number
  sub_category_id: number
  video: null
  file: { $path: string }
  image_src: string
  video_type: string
}): Promise<any> => {
  return genericQueryFn({
    url: API_COURSES_LECTURES,
    method: 'POST',
    body: { lectureData: data }
  })
}
