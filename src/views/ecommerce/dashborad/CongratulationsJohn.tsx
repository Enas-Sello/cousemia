// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

const CongratulationsJohn = () => {
  return (
    <Card>
      <Grid container>
        <Grid size={{ xs: 8 }}>
          <CardContent>
            <Typography variant='h6' component='h4' className='mbe-1'>
              Congratulations🎉John
            </Typography>
            <Typography variant='subtitle2' component='p' className='mbe-3'>
              Best seller of the month
            </Typography>
            <Typography variant='h4' color='primary.main' className='mbe-2'>
              $48.9k
            </Typography>
            <Button variant='contained' color='primary'>
              View Sales
            </Button>
          </CardContent>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <div className='relative bs-full is-full'>
            <img
              alt='Congratulations John'
              src='/images/illustrations/characters/8.png'
              className='max-bs-[150px] absolute block-end-0 inline-end-6 max-is-full'
            />
          </div>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CongratulationsJohn
