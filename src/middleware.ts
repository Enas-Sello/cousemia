import { type NextRequest, NextResponse } from 'next/server'

import type { NextRequestWithAuth } from 'next-auth/middleware'
import { withAuth } from 'next-auth/middleware'

import { withoutSuffix } from './utils/string'

const HOME_URL = '/dashboard'

const redirectAction = (url: string, request: NextRequestWithAuth) => {
  const redirectUrl = new URL(url, request.url).toString()

  return NextResponse.redirect(redirectUrl)
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname
    const isUserLoggedIn = !!token
    const guestRoutes = ['login']

    // Shared routes (Routes that can be accessed by both guest and logged in users)
    const sharedRoutes = ['shared-route']

    // Private routes (All routes except guest and shared routes that can only be accessed by logged in users)
    const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))

    // If the user is not logged in and is trying to access a private route, redirect to the login page
    if (!isUserLoggedIn && privateRoute) {
      let redirectUrl = '/login'

      if (pathname === '/') {
        const searchParamsStr = new URLSearchParams({ redirectTo: withoutSuffix(pathname, '/') }).toString()

        redirectUrl += `?${searchParamsStr}`
      }

      return redirectAction(redirectUrl, request)
    }

    // If the user is logged in and is trying to access a guest route, redirect to the root page
    const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      return redirectAction(HOME_URL, request)
    }

    // If the user is logged in and is trying to access root page, redirect to the home page
    if (pathname === '/') {
      return redirectAction(HOME_URL, request)
    }

    NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => {
        return true
      }
    }
  }
)

// Matcher Config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside the public folder
     *    - images (public images)
     *    - next.svg (Next.js logo)
     *    - vercel.svg (Vercel logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|next.svg|vercel.svg).*)'
  ]
}
