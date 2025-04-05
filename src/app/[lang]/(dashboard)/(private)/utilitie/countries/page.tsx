'use client'
import { useState } from 'react'

import { Card, CardContent, CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid2'


import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import StatusAndVerifiedFilters from '@/components/StatusAndVerifiedFilters'
import CountriesTable from '@/views/countries/CountriesTable'

export default function Page() {
  const [status, setStatus] = useState<string>('')

  return (
    <AnimationContainer>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Filters' className='pbe-4' />
            <CardContent>
              <StatusAndVerifiedFilters setStatus={setStatus} Verified />
            </CardContent>
          </Card>
        </Grid>
        <CountriesTable status={status} />
      </Grid>
    </AnimationContainer>
  )
}

//to do delete
