import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/diagnosis',
  '/prognosis', 
  '/treatment',
  '/monitoring',
  '/patients',
  '/reports',
  '/settings',
  '/support'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get authentication token from cookies or headers
  const token = request.cookies.get('quantnex-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (pathname === '/login' && token) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Allow the request to continue for all other cases (including landing page)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
