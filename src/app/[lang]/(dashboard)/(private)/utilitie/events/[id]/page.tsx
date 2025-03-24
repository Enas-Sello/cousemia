'use client'
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { Typography, Card, CardContent, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { fetchEventById } from '@/data/events/eventsQuery'
import Loading from '@/components/loading'
import ErroBox from '@/components/ErrorBox'
import { getAvatar } from '@/libs/helpers/getAvatar'

const ViewEvent = () => {
  const { id } = useParams()

  // Fetch event data using React Query
  const {
    data: eventResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id as string),
    enabled: !!id // Only fetch if id exists
  })

  const event = eventResponse?.data

  if (isLoading) return <Loading />
  if (error) return <ErroBox error={error} refetch={refetch} />

  return (
    <>
      {event && (
        <Grid container spacing={6} sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Event Details
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getAvatar({ image: event.image })}
                <Typography variant='h6'>{event.title_en}</Typography>
              </Box>
              <Typography variant='body1'>
                <strong>Title (Arabic):</strong> {event.title_ar || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Event URL:</strong>{' '}
                <a
                  href={event.event_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {event.event_url}
                </a>
              </Typography>
              <Typography variant='body1'>
                <strong>Status:</strong> {event.status}
              </Typography>
              <Typography variant='body1'>
                <strong>Active:</strong> {event.is_active ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  )
}

export default ViewEvent
