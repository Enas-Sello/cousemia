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


// Fetch a single Questio by ID
export const getQuestion = async (id: string): Promise<any> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}/${id}`,
    method: 'GET'
  })
}


// Update question
export const updateQuestion = async (id: number, data: FormData): Promise<any> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}/${id}`,
    method: 'PUT',
    body: data
  })
}


// Update question status (active/inactive)
export const addNewQuestion = async (body: any): Promise<any> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}`,
    method: 'POST',
    body: body
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
export const deleteQuestion = async (id: number): Promise<void> => {
  return genericQueryFn({
    url: `${API_QUESTIONS}/${id}`,
    method: 'DELETE'
  })
}
