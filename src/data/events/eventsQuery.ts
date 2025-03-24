// data/events/eventsApi.ts
import { API_EVENTS } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Type for a single event
export type Event = {
  id: number
  title_en: string
  title_ar: string | null
  event_url: string
  image: string
  is_active: boolean
  status: string
}

// Type for the API response containing a list of events
export type EventsListResponse = {
  total: number
  events: Event[]
}

// Type for the API response for a single event
export type EventResponse = {
  data: Event
  message: string
  status_code: number
}

// Type for updating an event
export type UpdateEventData = {
  id: number
  title_en: string
  title_ar: string | null
  event_url: string
  image?: string // URL of the uploaded image
  image_id?: string // ID of the uploaded image (if applicable)
  is_active: boolean
}

// Fetch all events
export const fetchEvents = async (queryString: Record<string, any> = {}): Promise<EventsListResponse> => {
  return genericQueryFn({
    url: API_EVENTS,
    method: 'GET',
    queryParams: queryString
  })
}

// Function to fetch an event by ID
export const fetchEventById = async (id: string): Promise<EventResponse> => {
  return genericQueryFn({
    url: `${API_EVENTS}/${id}`,
    method: 'GET'
  })
}

// Function to update an event by ID
export const updateEvent = async (data: UpdateEventData) => {
  return genericQueryFn({
    url: `${API_EVENTS}/${data.id}`,
    method: 'PUT',
    body: data
  })
}

// Function to delete an event by ID
export const deleteEvent = async (id: number) => {
  return genericQueryFn({
    url: `${API_EVENTS}/${id}`,
    method: 'DELETE'
  })
}
