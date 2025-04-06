import { API_URL, API_LECTURES, API_COURSES_LECTURES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { LectureResponse, LecturesResponse } from '@/types/lectureType'

// Fetch lectures with optional query parameters
export const getLectures = async (queryString: Record<string, any> = {}): Promise<LecturesResponse> => {
  return genericQueryFn({
    url: API_LECTURES,
    method: 'GET',
    queryParams: queryString
  })
}

// Fetch a single lectures by ID
export const getLecture = async (id: number): Promise<LectureResponse> => {
  return genericQueryFn({
    url: `${API_LECTURES}/${id}`,
    method: 'GET'
  })
}

// Update lecture
export const updateLecture = async (id: number, data: FormData): Promise<any> => {
  return genericQueryFn({
    url: `${API_LECTURES}/${id}`,
    method: 'PUT',
    body: data
  })
}

// Update lecture status (active/inactive)
export const updateLectureStatus = async (id: number, status: boolean): Promise<any> => {
  return genericQueryFn({
    url: `${API_LECTURES}/${id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}

// Delete a lecture by ID
export const deleteLecture = async (id: number): Promise<any> => {
  return genericQueryFn({
    url: `${API_LECTURES}/${id}`,
    method: 'DELETE'
  })
}

// Upload a video for a lecture
export const uploadLectureVideo = async (data: FormData): Promise<any> => {
  console.log('data', data) // Kept for debugging; consider removing in production

  return genericQueryFn({
    url: `${API_LECTURES}/upload-video`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Required for FormData uploads
    }
  })
}

// Upload an image for a lecture
export const uploadLectureImage = async (data: FormData): Promise<any> => {
  console.log('dataimg', data) // Kept for debugging; consider removing in production

  return genericQueryFn({
    url: `${API_URL}/media`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Required for FormData uploads
    }
  })
}

// Store a new lecture
export const storeLecture = async (data: {
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
    url: `${API_COURSES_LECTURES}/store`,
    method: 'POST',
    body: data
  })
}
