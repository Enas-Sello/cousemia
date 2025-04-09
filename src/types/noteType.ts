export type NoteType = {
  id: number
  title_en: string
  title_ar: string
  category: string
  sub_category: string
  category_id: number
  sub_category_id: number
  admin_id: number
  url: string
  course_id: number
  course: string
  is_active: boolean
  is_free_content: boolean
  status: string
  created_at: string
  created_by: string
}

export interface NotesResponse {
  total: number
  notes: NoteType[]
}
export interface NotesProps {
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}
