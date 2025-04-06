export interface ReviewType {
  id: number
  date: string
  type: string
  comment?: string
  rating?: number
}

// Define the API response type
export interface CourseReviewResponse {
  total: number
  reviews: ReviewType[]
}
