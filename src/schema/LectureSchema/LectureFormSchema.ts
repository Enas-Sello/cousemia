import * as v from 'valibot'

import { BaseSchema } from '../Validation'

export const LectureFormSchema = v.object({
 ...BaseSchema,
  course_id: v.number([v.minValue(1, 'Course is required')]),
  category_id: v.number([v.minValue(1, 'Category is required')]),
  sub_category_id: v.number(), // Optional? Add validation if required
  
  
  video_thumb: v.number([v.minValue(1, 'Thumbnail is required')]),
  image_src: v.string(),

  video_type: v.union([
    v.literal('upload'),
    v.literal('url')
  ]),
  
  path: v.nullable(v.any()),
  video: v.nullable(v.any()),
  file:v.optional(
    v.object({
      $path:v.optional(v.string()),
    }),
  ) 
})
