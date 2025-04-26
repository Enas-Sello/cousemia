'use client'
import { useState } from 'react'

import { Card, CardContent, CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid2'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import StatusAndVerifiedFilters from '@/components/form-fields/StatusAndVerifiedFilters'
import OffersTable from '@/views/offers/OffersTable'
import PageHeader from '@/components/PageHeader'

export default function Page() {
  const [status, setStatus] = useState<string>('')

  return (
    <AnimationContainer>
      <PageHeader title='Offers' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Offers' }]} />

      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Filters' className='pbe-4' />
            <CardContent>
              <StatusAndVerifiedFilters setStatus={setStatus} Verified />
            </CardContent>
          </Card>
        </Grid>
        <OffersTable status={status} />
      </Grid>
    </AnimationContainer>
  )
}

//to do delete
