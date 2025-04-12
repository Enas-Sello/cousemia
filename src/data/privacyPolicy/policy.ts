import { API_POLICY } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { EditorResponse, UpdateEditorData } from '@/types/editor'

// Fetch the "Plicy" content
export const getPolicyContent = async (): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_POLICY,
    method: 'GET'
  })
}

// Update the "Plicy" content
export const updatePolicyContent = async (data: UpdateEditorData): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_POLICY,
    method: 'PUT',
    body: data
  })
}
