'use client'
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { Typography, Card, CardContent, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { fetchOfferById } from '@/data/offers/offersQuery'
import Loading from '@/components/loading'
import ErroBox from '@/components/ErrorBox'
import { getAvatar } from '@/libs/helpers/getAvatar'

const ViewOffer = () => {
  const { id } = useParams()

  // Fetch offer data using React Query
  const {
    data: offerResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => fetchOfferById(id as string),
    enabled: !!id // Only fetch if id exists
  })

  const offer = offerResponse?.data

  if (isLoading) return <Loading />
  if (error) return <ErroBox error={error} refetch={refetch} />

  return (
    <>
      {offer && (
        <Grid container spacing={6} sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Offer Details
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getAvatar({ image: offer.image })}
                <Typography variant='h6'>{offer.title_en}</Typography>
              </Box>
              <Typography variant='body1'>
                <strong>Title (Arabic):</strong> {offer.title_ar || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Offer Value:</strong> {offer.offer_value}
              </Typography>
              <Typography variant='body1'>
                <strong>Offer Type:</strong> {offer.offer_type}
              </Typography>
              <Typography variant='body1'>
                <strong>Offer Code:</strong> {offer.offer_code}
              </Typography>
              <Typography variant='body1'>
                <strong>Expiration Date:</strong> {offer.expiration_date}
              </Typography>
              <Typography variant='body1'>
                <strong>Selected Courses:</strong>{' '}
                {offer.selected_courses.map(course => course.title).join(', ') || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Status:</strong> {offer.status}
              </Typography>
              <Typography variant='body1'>
                <strong>Active:</strong> {offer.is_active ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  )
}

export default ViewOffer
