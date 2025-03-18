import { getServerSession } from 'next-auth'

import { ApiAuthOptions } from '@/libs/auth'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default async function Page() {
  const session = await getServerSession(ApiAuthOptions)

  return (
    <AnimationContainer>
      <p>{JSON.stringify(session?.user?.fullname)}</p>
    </AnimationContainer>
  )
}

//to do delete
