import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root)
     * - /request (request pages - 認証不要)
     * - /answer (answer pages - 認証不要)
     */
    '/((?!api|webhook|_next/static|_next/image|favicon.ico|request|answer|result|$).*)',
  ],
};

export const middleware = async (request: NextRequest) => {
  request.headers.set('next-url', request.nextUrl.pathname);
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next({
    request,
  });
};
