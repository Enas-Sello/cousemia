import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'

const DetailsSkeleton = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant='rectangular' height={400} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant='text' width='60%' height={60} />
        <Skeleton variant='text' width='40%' height={40} />
        <Skeleton variant='rectangular' width='100%' height={100} sx={{ mt: 2 }} />
      </Grid>
    </Grid>
  )
}

export default DetailsSkeleton
