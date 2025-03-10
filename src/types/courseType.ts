export type CourseType = {
  id: number
  title_en: string
  title_ar: string
  image: string
  description_en: string
  description_ar: string
  speciality: string
  speciality_id: number
  rate: number | 0
  price: number
  admin_name: string
  price_after_discount: string
  is_active: boolean
  status: string
  expire_date: string
  expire_duration: string
  bought_on: string
  lectures_count: number
  notes_count: number
  flashcards_count: number
  questions_count: number
  flash_cards_count: number
}

export type CourseFormType = {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
}
