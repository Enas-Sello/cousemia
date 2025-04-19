import {
  API_COURSES,
  API_ALL_COURSES,
  API_USERS,
  API_URL,
  API_GET_COURSE_IMAGES,
  API_CATEGORIES_COURSE_By_ID,
  API_COURSE_REVIEW
} from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { CourseType } from '@/types/courseType'

import type { ImageType } from '@/types/imageType'
import type { CourseReviewResponse } from '@/types/reviews'

// Fetch all courses with optional query parameters
export const getCourses = async (
  queryString: Record<string, any> = {}
): Promise<{ courses: CourseType[]; total: number }> => {
  return genericQueryFn({
    url: API_COURSES,
    method: 'GET',
    queryParams: queryString
  })
}

// Fetch a single course by ID
export const getCourse = async (id: number): Promise<CourseType> => {
  return genericQueryFn({
    url: `${API_COURSES}/${id}`,
    method: 'GET'
  })
}

// Delete a single course by ID
export const deleteCourse = async (id: number): Promise<CourseType> => {
  return genericQueryFn({
    url: `${API_COURSES}/${id}`,
    method: 'DELETE'
  })
}

// Update a course by ID
export const updateCourse = async (id: number, course: any): Promise<CourseType> => {
  return genericQueryFn({
    url: `${API_COURSES}/${id}`,
    method: 'PUT',
    body: course
  })
}

// courses review
export const getCourseReview = async (id: number, queryString: Record<string, any>): Promise<CourseReviewResponse> => {
  return genericQueryFn({
    url: `${API_COURSE_REVIEW}/${id}`,
    method: 'GET',
    queryParams: queryString
  })
}

//////////////
// Assign courses to a user
export const courseAssignToUser = async (userId: number, courseIds: number[]): Promise<any> => {
  await genericQueryFn({
    url: `${API_USERS}/assign-course-to-user`,
    method: 'POST',
    body: { user_id: userId, course_ids: courseIds }
  })

  // Fetch the updated user data after assignment
  return genericQueryFn({
    url: `${API_USERS}/${userId}`,
    method: 'GET'
  })
}

// Delete a course from a user
export const deleteUserCourse = async (courseId: number | undefined, userId: number | undefined): Promise<number> => {
  const response = await genericQueryFn({
    url: `${API_USERS}/delete-course-from-user`,
    method: 'POST',
    body: { course_id: courseId, user_id: userId }
  })

  return response.status // Assuming the response includes a status field
}

// Fetch the list of all courses
// export const getCourseList = async (): Promise<CourseType[]> => {
export const getCourseList = async (): Promise<any> => {
  return genericQueryFn({
    url: API_ALL_COURSES,
    method: 'GET'
  })
}

// Fetch course images by course ID
export const getCourseImages = async (id: number): Promise<ImageType[]> => {
  return genericQueryFn({
    url: API_GET_COURSE_IMAGES,
    method: 'GET',
    queryParams: { course_id: id }
  })
}

// Upload multiple course images
export const uploadCourseImage = async (data: FormData): Promise<any> => {
  return genericQueryFn({
    url: `${API_URL}/media/multi`,
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data' // Required for FormData uploads
    }
  })
}

// Upload a single course image
export const uploadSingleCourseImage = async (images: ImageType[], course_id: number): Promise<any> => {
  return genericQueryFn({
    url: `${API_URL}/single-course-images`,
    method: 'POST',
    body: { images, course_id }
  })
}

// Fetch course by category ID
export const getCourseByCategoriesID = async (categoriesID: number): Promise<{ data: any }> => {
  return genericQueryFn({
    url: `${API_CATEGORIES_COURSE_By_ID}/?category_id=${categoriesID}`,
    method: 'GET'
  })
}

// Delete a course image
export const deleteCourseImage = async (image: number | undefined, course_id: number): Promise<any> => {
  return genericQueryFn({
    url: `${API_URL}/delete-course-image`,
    method: 'POST',
    body: { image, course_id }
  })
}
