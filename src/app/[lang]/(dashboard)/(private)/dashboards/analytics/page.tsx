import { getServerSession } from 'next-auth'

import { ApiAuthOptions } from '@/libs/auth'

export default async function Page() {
  const session = await getServerSession(ApiAuthOptions)

  return <p>{session?.user?.fullname}</p>
}
