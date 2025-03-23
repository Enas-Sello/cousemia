// calendarQueries.ts - React Query hooks

import { useState } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { EventInput } from '@fullcalendar/core'

import type { CalendarFiltersType } from '@/types/apps/calendarTypes'

// Mock API endpoints (replace with real API calls)
const API_URL = '/api/calendar'

export const calendarApi = {
  getEvents: async (): Promise<EventInput[]> => {
    const response = await fetch(`${API_URL}/events`)

    return response.json()
  },

  addEvent: async (event: EventInput): Promise<EventInput> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' }
    })

    return response.json()
  },

  updateEvent: async (event: EventInput): Promise<EventInput> => {
    const response = await fetch(`${API_URL}/events/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' }
    })

    return response.json()
  },

  deleteEvent: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    })
  }
}

const filterEventsUsingCheckbox = (events: EventInput[], selectedCalendars: CalendarFiltersType[]) => {
  return events.filter(event => selectedCalendars.includes(event.extendedProps?.calendar as CalendarFiltersType))
}

export const useCalendar = () => {
  const queryClient = useQueryClient()

  // Local state for UI controls
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null)

  const [selectedCalendars, setSelectedCalendars] = useState<CalendarFiltersType[]>([
    'Personal',
    'Business',
    'Family',
    'Holiday',
    'ETC'
  ])

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarApi.getEvents,
    select: data => filterEventsUsingCheckbox(data, selectedCalendars)
  })

  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: calendarApi.addEvent,
    onSuccess: newEvent => {
      queryClient.setQueryData<EventInput[]>(['calendarEvents'], old => {
        return old ? [...old, newEvent] : [newEvent]
      })
    }
  })

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: calendarApi.updateEvent,
    onSuccess: updatedEvent => {
      queryClient.setQueryData<EventInput[]>(['calendarEvents'], old => {
        return old?.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
      })
    }
  })

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: calendarApi.deleteEvent,
    onSuccess: (_, id) => {
      queryClient.setQueryData<EventInput[]>(['calendarEvents'], old => {
        return old?.filter(event => event.id !== id)
      })
    }
  })

  // Calendar filter handlers
  const handleFilterCalendarLabel = (calendar: CalendarFiltersType) => {
    setSelectedCalendars(prev => {
      const index = prev.indexOf(calendar)

      if (index !== -1) {
        return prev.filter((_, i) => i !== index)
      }

      return [...prev, calendar]
    })
  }

  const handleFilterAllCalendarLabels = (checked: boolean) => {
    setSelectedCalendars(checked ? ['Personal', 'Business', 'Family', 'Holiday', 'ETC'] : [])
  }

  return {
    events,
    isLoading,
    selectedEvent,
    selectedCalendars,
    addEvent: addEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    setSelectedEvent,
    filterCalendarLabel: handleFilterCalendarLabel,
    filterAllCalendarLabels: handleFilterAllCalendarLabels
  }
}
