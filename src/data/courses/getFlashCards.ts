import { API_URL, API_FLASH_CARDS, API_COURSES_LECTURES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'
import { genericQueryFn } from '@/libs/queryFn'

export const getFlashCards = async (queryString: Record<string, any> = {}) => {
  return genericQueryFn({
    url: API_FLASH_CARDS,
    method: 'GET',
    queryParams: queryString
  })
}

export const updateFlashCardStatus = async (id: number, status: boolean) => {
  const url = API_FLASH_CARDS + `/${id}`
  const res = await AxiosRequest.put(url, { is_active: status })

  return res
}

export const deleteFlashCard = async (id: number) => {
  const url = API_FLASH_CARDS + `/${id}`
  const res = await AxiosRequest.delete(url)

  return res
}

export const uploadFlashCardVideo = async (data: FormData) => {
  const url = API_FLASH_CARDS + '/upload-video'

  const res = await AxiosRequest.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data
}

export const uploadFlashCardImage = async (data: FormData) => {
  const url = API_URL + '/media'

  const res = await AxiosRequest.post(url, data, {
    headers: {
      'Content-Type': 'image/png'
    }
  })

  return res.data.data
}

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
}) => {
  const url = API_COURSES_LECTURES

  const res = await AxiosRequest.post(url, { lectureData: data })

  return res.data
}
