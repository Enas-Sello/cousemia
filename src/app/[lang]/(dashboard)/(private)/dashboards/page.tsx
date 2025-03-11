import { getServerSession } from 'next-auth'


import { ApiAuthOptions } from '@/libs/auth'

export default async function Page() {
  const session = await getServerSession(ApiAuthOptions)

  return (
    <>
      <p>{JSON.stringify(session?.user?.fullname)}</p>
    </>
  )
}
