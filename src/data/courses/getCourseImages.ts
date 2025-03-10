import { API_URL, API_GET_COURSE_IMAGES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'
import type { ImageType } from '@/types/imageType'

export const getCourseImages = async (id: number) => {
  const res = await AxiosRequest.get(API_GET_COURSE_IMAGES + `/?course_id=${id}`)

  return res.data.data
}

export const uploadCourseImage = async (data: FormData) => {
  const url = API_URL + '/media/multi'

  const res = await AxiosRequest.post(url, data, {
    headers: {
      'Content-Type': 'image/png'
    }
  })

  return res.data
}

export const uploadSingleCourseImage = async (images: ImageType[], course_id: number) => {
  const url = API_URL + '/single-course-images'

  const res = await AxiosRequest.post(url, { images, course_id })

  return res.data
}

export const deleteCourseImage = async (image: number | undefined, course_id: number) => {
  const url = API_URL + '/delete-course-image'

  const res = await AxiosRequest.post(url, { image, course_id })

  return res.data
}
