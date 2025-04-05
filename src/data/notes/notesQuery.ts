// D:\Projects\teamWork\cousema\src\data\nots\getNots.ts
import { API_NOTES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch notes with optional query parameters
export const getNotes = async (queryString: Record<string, any> = {}): Promise<any> => {
  return genericQueryFn({
    url: API_NOTES,
    method: 'GET',
    queryParams: queryString
  })
}

