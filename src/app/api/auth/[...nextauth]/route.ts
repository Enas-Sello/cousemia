import NextAuth from 'next-auth'

import { ApiAuthOptions } from '@/libs/auth'

const handler = NextAuth(ApiAuthOptions)

export { handler as GET, handler as POST }
