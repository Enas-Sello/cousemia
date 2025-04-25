import type { SubCategory } from './lectureType'

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
  subs?: SubCategory[]
}

export interface NotesResponse {
  total: number
  notes: NoteType[]
}
export interface NoteResponse {
  data: NoteType
}
export interface NotesProps {
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}
export interface NoteAddResponse {
  data: NoteType;
  message: string;
  status_code: number;
}
export interface NewNoteFormData {
  title_en: string;
  title_ar: string;
  pdf_type: 'upload' | 'url';
  course_id: number;
  category_id: number;
  sub_category_id: number;
  is_free_content: string;
  path: string;
  file: File | null;
}
export interface NoteProps {
  open: boolean;
  handleClose: () => void;
}
