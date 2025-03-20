import { CircularProgress } from '@mui/material'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <AnimationContainer>
      <CircularProgress />
    </AnimationContainer>
  )
}
