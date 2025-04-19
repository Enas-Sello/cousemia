'use client'
import Grid from '@mui/material/Grid2'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import HostCourseTable from '@/views/hostCourse/HostCourseTable'
import PageHeader from '@/components/PageHeader'

export default function HostCourse() {
  return (
    <AnimationContainer>
        <PageHeader title='HostCourse' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'HostCourse' }]} />
        <Grid container spacing={6}>
          <HostCourseTable />
        </Grid>
      </AnimationContainer>
    
  )
}
