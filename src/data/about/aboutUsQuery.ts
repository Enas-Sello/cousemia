import { API_ABOUT_US } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { EditorResponse, UpdateEditorData } from '@/types/editor'

// Fetch the "About Us" content
export const getAboutUsContent = async (): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_ABOUT_US,
    method: 'GET'
  })
}

// Update the "About Us" content
export const updateAboutUsContent = async (data: UpdateEditorData): Promise<EditorResponse> => {
  return genericQueryFn({
    url: API_ABOUT_US,
    method: 'PUT',
    body: data
  })
}
