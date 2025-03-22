export const API_URL = process.env.NEXT_PUBLIC_API_URL as string
export const API_LOGIN = API_URL + '/auth/login'
export const API_COURSES = API_URL + '/courses'
export const API_ALL_COURSES = API_URL + '/all-courses'
export const API_ADMIN = API_URL + '/all-admins'
export const API_LECTURES = API_URL + '/lectures'
export const API_COURSES_LECTURES = API_URL + '/course-lectures'
export const API_NOTES = API_URL + '/notes'
export const API_QUESTIONS = API_URL + '/questions'
export const API_FLASH_CARDS = API_URL + '/flash-cards'
export const API_CATEGORIES_BY_CourseID = API_URL + '/categories'
export const API_CATEGORIES = API_URL + '/all-categories'
export const API_COURSE_CATEGORIES = API_URL + '/course-categories'
export const API_SUB_CATEGORIES = API_URL + '/sub-categories'
export const API_GET_COURSE_IMAGES = API_URL + '/get-course-images'

//users
export const API_USERS = API_URL + '/users'

//utilities
export const API_SPECIALTIES = API_URL + '/specialities'
export const API_COUNTRIES = API_URL + '/countries'
export const API_HOSTCOURSE = API_URL + '/host-course-requests'
export const API_EVENTS = API_URL + '/events'
export const API_OFFERS = API_URL + '/offers'
export const API_ABOUT_US = API_URL + '/about-us'
