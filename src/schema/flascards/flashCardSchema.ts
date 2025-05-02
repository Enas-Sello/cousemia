import { object, string, boolean, number, optional } from 'valibot';

export const FlashCardSchema = object({
  front_en: string(),
  front_ar: string(),
  back_en: string(),
  back_ar: string(),
  course_id: number(),
  category_id: number(),
  sub_category_id: optional(number()),
  is_free_content: boolean(),
  is_active: boolean(), 
});
