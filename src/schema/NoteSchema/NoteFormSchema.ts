import * as v from 'valibot';

import { BaseSchema, CourseDataSchema } from '../Validation';

export const NoteFormSchema = v.object({
  ...BaseSchema,
 ...CourseDataSchema,
  pdf_type: v.union([
    v.literal('upload'),
    v.literal('url')
]),
  video_thumb: v.nullable(v.any()),
  path: v.nullable(v.any()),//the pdf url in the input field
  file:v.nullable(v.any()),
});

export type NoteFormType = v.Output<typeof NoteFormSchema>;
