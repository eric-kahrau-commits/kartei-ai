import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/home', '/create', '/learn'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.has('auth_session');

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected && !authed) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/' && authed) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
