import * as v from 'valibot'

export const LectureFormSchema = v.object({
  title_en: v.string([v.minLength(1, 'Title (English) is required')]),
  title_ar: v.nullable(v.string()),
  video_type: v.string([v.minLength(1, 'Video type is required')]),
  url: v.string([v.minLength(1, 'Lecture URL is required')]),
  description_en: v.string([v.minLength(1, 'Description (English) is required')]),
  description_ar: v.nullable(v.string()),
  course_id: v.number([
    v.minValue(1, 'Please select a valid course'),
    v.custom(value => !isNaN(value), 'Course is required')
  ]),
  category_id: v.number([
    v.minValue(1, 'Please select a valid category'),
    v.custom(value => !isNaN(value), 'Category is required')
  ]),
  sub_category_id: v.optional(v.number()),

  is_active: v.boolean(),
  is_free_content: v.boolean(),
  // image: v.string([
  //   v.minLength(1, 'A cover image is required'),
  //   v.regex(/^\d+$/, 'Image ID must be a valid number') // Ensure the image ID is a string of digits
  // ])
  image: v.string([v.minLength(1, 'A cover image is required')])
})
