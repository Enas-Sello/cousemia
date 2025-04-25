import * as v from 'valibot'

export const BaseSchema = {
  title_en: v.string([v.minLength(1, 'English title is required')]),
  title_ar: v.string(),
  description_en: v.optional(v.string()),
  description_ar: v.optional(v.string()),
  is_free_content: v.string([v.minLength(1, 'This field is required')]),
 
}
export const CourseDataSchema = {
  course_id: v.number([v.minValue(1, 'Course is required')]),
  category_id: v.number([v.minValue(1, 'Category is required')]),
  sub_category_id: v.number(), 
   
}
