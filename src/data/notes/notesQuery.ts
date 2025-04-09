// D:\Projects\teamWork\cousema\src\data\nots\getNots.ts
import { API_NOTES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { NoteResponse, NotesResponse } from '@/types/noteType'

// Fetch notes with optional query parameters
export const getNotes = async (queryString: Record<string, any> = {}): Promise<NotesResponse> => {
  return genericQueryFn({
    url: API_NOTES,
    method: 'GET',
    queryParams: queryString
  })
}

export const deleteNote = async (id: number): Promise<void> => {
  return genericQueryFn({
    url: `${API_NOTES}/${id}`,
    method: 'DELETE'
  })
}

export const getNote = async (id: number): Promise<NoteResponse> => {
  return genericQueryFn({
    url: `${API_NOTES}/${id}`,
    method: 'GET'
  })
}
