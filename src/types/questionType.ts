import type { SubCategory } from "./lectureType";

type Answer = {
  answer_en: string
  answer_ar?: string 
 is_correct: boolean | number;
   showArabicAnswer: boolean 
}

export type QuestionType = {
  category_id: number
  admin_id: number
  sub_category_id: number
  sub_category: string
  id: number
  image: string
  url: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  explanation_en: string
  explanation_ar: string
  explanation_image: string
  explanation_voice: string
  course_id: number
  category: string
  course: string
  is_active: boolean
  is_free_content: boolean
  status: string
  created_at: string
  created_by: string
}

export type QuestionProps ={
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}
export type NewQuestionFormData={
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  explanation_en: string
  explanation_ar: string
  image?: File | null |string
  image_id?: number // Store the uploaded image ID
  explanation_image?: File | null
  explanation_image_id?: number // Store the uploaded explanation image ID
  explanation_voice?: File | null
  voice_type: 'upload' | 'record' | null
  answers: Answer[]
  category_id: number
  course_id: number
  sub_category_id?: number
  is_free_content: string
}

export interface updateQuestionType extends NewQuestionFormData {
  
  id?: number;
  is_active?: boolean;
  status?: string;

  admin_id?: number;
  created_at?: string;
  created_by?: string;
  category?: string;
  sub_category?: string;
  course?: string;
  subs?: SubCategory[];
}
