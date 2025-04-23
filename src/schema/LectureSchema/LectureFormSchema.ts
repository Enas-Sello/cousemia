import * as v from 'valibot'

export const LectureFormSchema = v.object({
  title_en: v.string([v.minLength(1, 'English title is required')]),
  title_ar: v.string(),
  description_en: v.string([v.minLength(1, 'English description is required')]),
  description_ar: v.string(),
  is_free_content: v.string([v.minLength(1, 'This field is required')]),
  video_url: v.string(),
  course_id: v.number([v.minValue(1, 'Course is required')]),
  category_id: v.number([v.minValue(1, 'Category is required')]),
  sub_category_id: v.number(), // Optional? Add validation if required
  video_thumb_url: v.string([v.minLength(1, 'Thumbnail is required')]),
  video_type: v.string([v.minLength(1, 'Video type is required')]),
  video: v.nullable(v.any()), // Optional file
  video_thumb: v.nullable(v.any()) // Optional file
})
