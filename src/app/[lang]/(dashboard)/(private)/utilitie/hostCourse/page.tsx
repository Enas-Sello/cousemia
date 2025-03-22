import Grid from '@mui/material/Grid2'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import HostCourseTable from '@/views/hostCourse/HostCourseTable'

export default async function Page() {
  return (
    <>
      <AnimationContainer>
        <Grid container spacing={6}>
          <HostCourseTable />
        </Grid>
      </AnimationContainer>
    </>
  )
}
