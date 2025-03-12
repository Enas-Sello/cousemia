import type { ISODateString, NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

import type { JWT } from 'next-auth/jwt'

import { API_LOGIN } from '@/configs/api'

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
  ability?: { action: string; subject: string }[] | []
  token?: string | null
}

export const ApiAuthOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.user = user
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
          const res = await fetch(API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }).then(response => response.json())

          const data = res.data
          const user = data.user

          user['token'] = data.token

          if (user) {
            return user
          }

          return null
        } catch (error: any) {
          throw new Error(error)
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
}
