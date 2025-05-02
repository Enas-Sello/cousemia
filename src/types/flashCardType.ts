import type { SubCategory } from "./lectureType"

export type FlashCardType = {
  admin_id: number
  back_ar: string
  back_en: string
  category: string
  category_id: number
  course: string
  course_id: number
  created_at: string
  created_by: string
  front_ar: string
  front_en: string
  id: number
  is_active: boolean
  is_free_content: number
  status: string
  sub_category: string
  sub_category_id: number

}
export type FlashCardViewProps ={
   flashCard: FlashCardType & { subs: SubCategory[] }
    
}
export type FlashCardsDataType= {
  front_en: string
  front_ar: string
  back_en: string
  back_ar: string
  course_id: string |number
  category_id: string |number
  sub_category_id?: string | null |number
  is_free_content: string | boolean
  is_active?:  boolean
}
 export type AddFlashCardDrawerProps = {
  open: boolean
  handleClose: () => void
  coursCategoryId?: number | null
}
