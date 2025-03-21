import { CircularProgress } from '@mui/material'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <AnimationContainer>
      <div className='flex justify-center items-center p-10'>
        <CircularProgress />
      </div>
    </AnimationContainer>
  )
}
