import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const redirects: Record<string, string> = {
  '/work': '/projects',
  '/services': '/projects',
  '/government': '/about',
  '/blog': '/',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }

  if (pathname.startsWith('/work/')) {
    const slug = pathname.replace('/work/', '');
    return NextResponse.redirect(new URL(`/projects/${slug}`, request.url));
  }

  if (pathname.startsWith('/services/')) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|images/|resume/).*)'],
};
