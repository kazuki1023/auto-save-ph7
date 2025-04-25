import { NextRequest, NextResponse } from 'next/server'
import { auth } from "./auth";
import { CustomSession } from "@/lib/auth/types";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root)
     */
    '/((?!api|webhook|_next/static|_next/image|favicon.ico|$).*)',
  ],
}

export const middleware = async (request: NextRequest) => {
  request.headers.set('next-url', request.nextUrl.pathname)
  const session = await auth() as CustomSession
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next({
    request,
  })
}
