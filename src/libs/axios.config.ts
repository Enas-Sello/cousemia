import axios from 'axios'
import { getSession } from 'next-auth/react'

import { API_URL } from '@/configs/api'
import type { LoggedInUser } from './auth'

const AxiosRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Client-side request interceptor to attach token
AxiosRequest.interceptors.request.use(
  async config => {
    // Get the session on the client side
    const session = await getSession()

    if (session) {
      const user = session.user as LoggedInUser

      // If a token exists, include it in the Authorization header
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default AxiosRequest
