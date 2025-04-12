import { minLength, object, string } from 'valibot'

export const editorSchema = object({
  content: string([minLength(1, 'This field is required')])
})
