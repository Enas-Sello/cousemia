// data/offers/offersApi.ts
import { genericQueryFn } from '@/libs/queryFn'
import { API_OFFERS } from '@/configs/api'

// Type for a selected course in the offer
export type SelectedCourse = {
  value: string
  title: string
}

// Type for a single offer
export type Offer = {
  id: number
  title_en: string
  title_ar: string | null
  image: string
  is_active: boolean
  selected_courses: SelectedCourse[]
  expiration_date: string
  offer_value: string
  offer_type: string
  offer_code: string
  status: string
}

// Type for the API response containing a list of offers
export type OffersListResponse = {
  total: number
  offers: Offer[]
}

// Type for the API response for a single offer
export type OfferResponse = {
  data: Offer
  message: string
  status_code: number
}

// Type for updating an offer
export type UpdateOfferData = {
  id: number
  title_en: string
  title_ar: string | null
  image?: string // URL of the uploaded image
  image_id?: string // ID of the uploaded image (if applicable)
  is_active: boolean
  selected_courses: SelectedCourse[]
  expiration_date: string
  offer_value: string
  offer_type: string
  offer_code: string
}

// Fetch all offers
export const fetchOffers = async (queryString: Record<string, any> = {}): Promise<OffersListResponse> => {
  return genericQueryFn({
    url: API_OFFERS,
    method: 'GET',
    queryParams: queryString
  })
}

// Function to fetch an offer by ID
export const fetchOfferById = async (id: string): Promise<OfferResponse> => {
  return genericQueryFn({
    url: `${API_OFFERS}/${id}`,
    method: 'GET'
  })
}

// Function to update an offer by ID
export const updateOffer = async (data: UpdateOfferData) => {
  return genericQueryFn({
    url: `${API_OFFERS}/${data.id}`,
    method: 'PUT',
    body: data
  })
}

// Function to delete an offer by ID
export const deleteOffer = async (id: number) => {
  return genericQueryFn({
    url: `${API_OFFERS}/${id}`,
    method: 'DELETE'
  })
}

