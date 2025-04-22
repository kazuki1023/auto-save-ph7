import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     */
    '/((?!api|webhook|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}

export const middleware = (request: NextRequest) => {
  request.headers.set('next-url', request.nextUrl.pathname)
  return NextResponse.next({
    request,
  })
}
