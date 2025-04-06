export type LectureType = {
  category_id: number
  admin_id: number
  sub_category_id: number
  sub_category: string
  id: number
  title_en: string
  title_ar: string
  url: string
  course_id: number
  image: string
  subs: SubCategory[]
  description_en: string
  description_ar: string
  category: string
  course: string
  is_active: boolean
  is_free_content: boolean
  status: string
  created_at: string
  created_by: string
}

export interface SubCategory {
  value: number
  label: string
  parent_category: string
}
export interface LecturesResponse {
  total: number
  lectures: LectureType[]
}

// Define the API response type
export interface LectureResponse {
  data: LectureType
  message: string
  status_code: number
}
