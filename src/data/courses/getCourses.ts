import { API_COURSES, API_ALL_COURSES, API_NOTES, API_USERS } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'

export const getCourses = async (queryString: {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(`${API_COURSES}?${query}`)

  return res.data
}

export const getCourse = async (id: number) => {
  const res = await AxiosRequest.get(`${API_COURSES}/${id}`)

  return res.data
}

export const getNotes = async (queryString: {} = {}) => {
  const query = new URLSearchParams(queryString)
  const res = await AxiosRequest.get(`${API_NOTES}?${query}`)

  return res.data
}

export const updateCourse = async (id: number, course: {}) => {
  const res = await AxiosRequest.put(`${API_COURSES}/${id}`, course)

  return res.data
}

export const courseAssignToUser = async (userId: number, courseIds: number[]) => {
  const url = API_USERS + '/assign-course-to-user'
  const res = await AxiosRequest.post(url, { user_id: userId, course_ids: courseIds })
  const response = await AxiosRequest.get(API_USERS + `/${userId}`)

  return response
}

export const deleteUserCourse = async (courseId: number, userId: number) => {
  const url = API_USERS + '/delete-course-from-user'
  const res = await AxiosRequest.post(url, { course_id: courseId, user_id: userId })

  return res.status
}

export const getCourseList = async () => {
  const res = await AxiosRequest.get(API_ALL_COURSES)

  return res.data
}
