import { API_TERMS } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { EditorResponse, UpdateEditorData } from '@/types/editor'

// Fetch the "Terms" content
export const getTermsContent = async (): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_TERMS,
    method: 'GET'
  })
}

// Update the "Terms" content
export const updateTermsContent = async (data: UpdateEditorData): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_TERMS,
    method: 'PUT',
    body: data
  })
}
