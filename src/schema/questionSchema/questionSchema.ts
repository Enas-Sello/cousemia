import * as v from 'valibot'

import { BaseSchema, CourseDataSchema } from '../Validation';

export const QuestionFormSchema = v.object({
 ...BaseSchema ,
  ...CourseDataSchema,

  explanation_en: v.string([v.minLength(1, 'English explanation is required')]),
  explanation_ar: v.string([v.minLength(1, 'Arabic explanation is required')]),
  
  // Image fields
  image: v.nullable(v.any()),
  image_id: v.optional(v.number()),
  explanation_image: v.nullable(v.any()),
  explanation_image_id: v.optional(v.number()),
  
  // Audio fields
  explanation_voice: v.nullable(v.any()),
  explanation_voice_path: v.optional(v.string()),
  voice_type: v.union([
    v.literal('upload'),
    v.literal('record'),
  ]),

  // Answers
  answers: v.array(
    v.object({
      answer_en: v.string([v.minLength(1, 'English answer is required')]),
      answer_ar: v.string([v.minLength(1, 'Arabic answer is required')]),
      is_correct: v.boolean(),
      showArabicAnswer: v.boolean()
    }),
    [v.minLength(1, 'At least one answer is required')]
  ),
  
});

