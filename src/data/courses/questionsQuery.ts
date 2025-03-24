import { API_QUESTIONS } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch questions with optional query parameters
export const getQuestions = async (queryString: Record<string, any> = {}): Promise<any> => {
  return genericQueryFn({
    url: API_QUESTIONS,
    method: 'GET',
    queryParams: queryString
  })
}

// Update question status (active/inactive)
export const updateQuestionStatus = async (id: number, status: boolean): Promise<any> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}/${id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}

// Delete a question by ID
export const deleteQuestion = async (id: number): Promise<any> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}/${id}`,
    method: 'DELETE'
  })
}
