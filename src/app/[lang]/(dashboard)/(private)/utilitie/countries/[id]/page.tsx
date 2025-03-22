'use client'

import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// import { toast } from 'react-toastify'

import { Box, Typography, Card, CardContent } from '@mui/material'

import { getCountryByID } from '@/data/countries/countriesApi'
import Loading from '@/components/loading'
import ErroBox from '@/components/ErrorBox'
import { getAvatar } from '@/libs/helpers/getAvatar'

export default function Page() {
  const { id } = useParams()

  // Fetch country data using React Query
  const {
    data: countryResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['country', id],
    queryFn: () => getCountryByID(id as string),
    enabled: !!id // Only fetch if id exists
  })

  const country = countryResponse?.data

  console.log('error.message', error)
  if (isLoading) return <Loading />
  if (error) return <ErroBox error={error} refetch={refetch} />

  return (
    <>
      {country && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h4' gutterBottom>
            Country Details
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getAvatar({ image: country.flag })}
                <Typography variant='h6'>{country.title_en}</Typography>
              </Box>
              <Typography variant='body1'>
                <strong>Title (Arabic):</strong> {country.title_ar || 'N/A'}
              </Typography>
              <Typography variant='body1'>
                <strong>Country Code:</strong> {country.country_code}
              </Typography>
              <Typography variant='body1'>
                <strong>Status:</strong> {country.status}
              </Typography>
              <Typography variant='body1'>
                <strong>Active:</strong> {country.is_active ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  )
}

//to do delete
