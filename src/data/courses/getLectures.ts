import { API_URL, API_LECTURES, API_COURSES_LECTURES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'
import { genericQueryFn } from '@/libs/queryFn'

export const getLectures = async (queryString: Record<string, any> = {}) => {
  return genericQueryFn({
    url: API_LECTURES,
    method: 'GET',
    queryParams: queryString
  })
}

export const updateLectureStatus = async (id: number, status: boolean) => {
  const url = API_LECTURES + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}

export const deleteLecture = async (id: number) => {
  return genericQueryFn({
    url: `${API_LECTURES}/${id}`,
    method: 'DELETE'
  })
}

export const uploadLectureVideo = async (data: FormData) => {
  console.log('data', data)

  return genericQueryFn({
    url: `${API_LECTURES}/upload-video`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Note: FormData sets this automatically, but we include it for clarity
    }
  })
}

export const uploadLectureImage = async (data: FormData) => {
  console.log('dataimg', data)

  const response = await genericQueryFn({
    url: `${API_URL}/media`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Note: FormData sets this automatically
    }
  })

  return response.data
}

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
}) => {
  return genericQueryFn({
    url: `${API_COURSES_LECTURES}/store`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
