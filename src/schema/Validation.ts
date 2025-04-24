import * as v from 'valibot'

export const BaseSchema = {
  title_en: v.string([v.minLength(1, 'English title is required')]),
  title_ar: v.string(),
  description_en: v.string([v.minLength(1, 'English description is required')]),
  description_ar: v.string(),
  is_free_content: v.string([v.minLength(1, 'This field is required')]),
 
}
