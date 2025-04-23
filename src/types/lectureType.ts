export type LectureProps = {
   open: boolean
  handleClose: () => void 
}

// Option type for dropdowns
export type dropdownsOptionType = {
  value: string | number
  label: string
}

export type LectureType = {
  image_id: undefined
  video_type: string
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


export type LecturesResponse= {
  total: number
  lectures: LectureType[]
}

export type LectureResponse= {
  data: LectureType
  message: string
  status_code: number
}

export type LectureFormData ={
  title_en: string
  title_ar: string | null
  description_ar: string | null
  description_en: string
  is_free_content: boolean
  video_type: string
  url: string
  course_id: number | undefined
  category_id: number | undefined
  sub_category_id: number | undefined
  is_active: boolean
  image?: File | string
  video_thumb: File | null
  video_thumb_url: string 
  video: File | null 
  video_url: string 
}

export type NewLectureFormData = {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  is_free_content: string
  video_thumb: File | null 
  video_thumb_url: string 
  course_id: number
  category_id: number
  sub_category_id: number
  video: File | null 
  video_url: string 
  video_type: string
}

export type SubCategory= {
  value: number
  label: string
  parent_category: string
}
