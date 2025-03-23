import type { ISODateString, NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'

import { API_LOGIN } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

export interface LoginSession {
  user?: LoggedInUser
  expires: ISODateString
}

export type LoggedInUser = {
  id?: string | null
  fullname?: string | null
  username?: string | null
  email?: string | null
  avatar?: string | null
  role?: string | null
  ability?: { action: string; subject: string }[]
  token?: string | null
}

export const ApiAuthOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user // Include the full user object with role
      }

      return token
    },
    async session({ session, token }: { session: LoginSession; token: JWT; user: LoggedInUser }) {
      session.user = token.user as LoggedInUser

      return session
    }
  },
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        try {
          const res = await genericQueryFn({
            url: API_LOGIN,
            method: 'POST',
            body: { email, password }
          })

          const data = res.data
          const user = data.user

          if (user) {
            user['token'] = data.token

            return user
          }

          return null
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
}
