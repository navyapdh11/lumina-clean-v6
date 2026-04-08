import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PREFIXES = [
  '/',
  '/residential',
  '/commercial',
  '/airbnb',
  '/real-estate',
  '/strata',
  '/ndis',
  '/sign-in',
  '/sign-up',
  '/emerald',
  '/book',
  '/booking-confirmation',
  '/api/webhooks',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and public routes
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    /\.(svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$/.test(pathname) ||
    isPublic(pathname)
  ) {
    return NextResponse.next();
  }

  // Admin dashboard protection — redirect to sign-in if no Clerk
  if (pathname.startsWith('/admin-dashboard')) {
    const hasClerk = !!(
      process.env.CLERK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.CLERK_SECRET_KEY.startsWith('sk_test_xxx') &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
    );

    if (!hasClerk) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication not configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');
      const isAdminRoute = createRouteMatcher(['/admin-dashboard(.*)']);
      const handler = clerkMiddleware(async (auth, request) => {
        if (isAdminRoute(request)) {
          const { userId } = await auth();
          if (!userId) {
            const signInUrl = new URL('/sign-in', request.url);
            signInUrl.searchParams.set('redirect_url', request.url);
            return NextResponse.redirect(signInUrl);
          }
        }
      });
      return handler(req as any, {} as any);
    } catch {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2)$).*)'],
};
