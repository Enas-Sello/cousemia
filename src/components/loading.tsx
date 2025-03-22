import { Box, CircularProgress } from '@mui/material'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <AnimationContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={30} />
      </Box>
    </AnimationContainer>
  )
}
